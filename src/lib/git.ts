import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const REPO_URL = process.env.GIT_REPO!;
const USERNAME = process.env.GIT_USERNAME!;
const TOKEN = process.env.GIT_TOKEN!;

export async function getRepoPath() {
  const tempDir = path.join(os.tmpdir(), 'git-pan-repo');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

export async function ensureClone() {
  const dir = await getRepoPath();
  const gitDir = path.join(dir, '.git');
  
  if (!fs.existsSync(gitDir)) {
    await git.clone({
      fs,
      http,
      dir,
      url: REPO_URL,
      onAuth: () => ({ username: USERNAME, password: TOKEN }),
      singleBranch: true,
      depth: 1,
    });
  } else {
    try {
      await git.pull({
        fs,
        http,
        dir,
        ref: 'main',
        onAuth: () => ({ username: USERNAME, password: TOKEN }),
        singleBranch: true,
      });
    } catch (e) {
      console.error('Pull failed, but continuing', e);
    }
  }
  return dir;
}

export async function listFiles() {
  const dir = await ensureClone();
  const files = await git.listFiles({ fs, dir });
  return files.filter(f => !f.startsWith('.git')).map(name => ({
    name,
    proxyUrl: '/api/files/' + encodeURIComponent(name)
  }));
}

export async function getFileContent(fileName: string) {
  const dir = await ensureClone();
  const filePath = path.join(dir, fileName);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}

export async function uploadFile(fileName: string, content: Buffer, targetPath: string = '') {
  const dir = await ensureClone();
  const finalPath = targetPath ? path.join(targetPath, fileName) : fileName;
  const fullPath = path.join(dir, finalPath);
  
  const fileDir = path.dirname(fullPath);
  if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

  fs.writeFileSync(fullPath, content);
  
  await git.add({ fs, dir, filepath: finalPath });
  await git.commit({
    fs,
    dir,
    author: { name: 'Git Pan', email: 'pan@example.com' },
    message: 'Upload ' + finalPath,
  });
  
  await git.push({
    fs,
    http,
    dir,
    onAuth: () => ({ username: USERNAME, password: TOKEN }),
  });
}

export async function renameFile(oldPath: string, newPath: string) {
  const dir = await ensureClone();
  const fullOldPath = path.join(dir, oldPath);
  const fullNewPath = path.join(dir, newPath);

  if (fs.existsSync(fullOldPath)) {
    const newDir = path.dirname(fullNewPath);
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
    
    fs.renameSync(fullOldPath, fullNewPath);
    await git.remove({ fs, dir, filepath: oldPath });
    await git.add({ fs, dir, filepath: newPath });
    
    await git.commit({
      fs,
      dir,
      author: { name: 'Git Pan', email: 'pan@example.com' },
      message: 'Rename ' + oldPath + ' to ' + newPath,
    });
    
    await git.push({
      fs,
      http,
      dir,
      onAuth: () => ({ username: USERNAME, password: TOKEN }),
    });
  }
}

export async function deleteFile(filePath: string) {
  const dir = await ensureClone();
  const fullPath = path.join(dir, filePath);

  if (fs.existsSync(fullPath)) {
    // If it's a directory, we need to handle it differently in git
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
        // isomorphic-git remove works on files. For directories we might need to list all files.
        const allFiles = await git.listFiles({ fs, dir });
        const filesInDir = allFiles.filter(f => f.startsWith(filePath + '/'));
        for (const f of filesInDir) {
            await git.remove({ fs, dir, filepath: f });
        }
        fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
        fs.unlinkSync(fullPath);
        await git.remove({ fs, dir, filepath: filePath });
    }
    
    await git.commit({
      fs,
      dir,
      author: { name: 'Git Pan', email: 'pan@example.com' },
      message: 'Delete ' + filePath,
    });
    
    await git.push({
      fs,
      http,
      dir,
      onAuth: () => ({ username: USERNAME, password: TOKEN }),
    });
  }
}

export async function createFolder(folderPath: string) {
  const dir = await ensureClone();
  const gitkeepPathRelative = path.join(folderPath, '.gitkeep').replace(/\\/g, '/');
  const fullGitkeepPath = path.join(dir, gitkeepPathRelative);
  
  const targetDir = path.dirname(fullGitkeepPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  
  fs.writeFileSync(fullGitkeepPath, '');
  
  await git.add({ fs, dir, filepath: gitkeepPathRelative });
  await git.commit({
    fs,
    dir,
    author: { name: 'Git Pan', email: 'pan@example.com' },
    message: 'Create folder ' + folderPath,
  });
  
  await git.push({
    fs,
    http,
    dir,
    onAuth: () => ({ username: USERNAME, password: TOKEN }),
  });
}

