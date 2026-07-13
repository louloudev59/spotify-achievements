const fs = require('path').isAbsolute ? require('fs') : require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd, cwd = process.cwd()) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd, stdio: 'inherit' });
}

try {
  console.log('Building project...');
  run('npx spicetify-creator --out=dist --minify');

  console.log('Copying documentation assets...');
  const distDir = path.join(__dirname, '..', 'dist');
  
  // Copy README.md
  fs.copyFileSync(
    path.join(__dirname, '..', 'README.md'),
    path.join(distDir, 'README.md')
  );

  // Copy preview.png if it exists in root
  const previewPath = path.join(__dirname, '..', 'preview.png');
  if (fs.existsSync(previewPath)) {
    fs.copyFileSync(previewPath, path.join(distDir, 'preview.png'));
    console.log('Copied preview.png');
  } else {
    console.log('Note: preview.png not found in root yet. You can add it later.');
  }

  // Get current git remote URL
  const remoteUrl = execSync('git remote get-url origin').toString().trim();
  console.log(`Detected remote origin: ${remoteUrl}`);

  // Publish process
  console.log('Initializing git repository in dist...');
  run('git init', distDir);
  run(`git remote add origin "${remoteUrl}"`, distDir);
  run('git checkout -b dist', distDir);
  run('git add .', distDir);
  run('git commit -m "Deploy compiled achievements app to dist"', distDir);
  
  console.log('Pushing compiled files to origin/dist branch...');
  run('git push -f origin dist', distDir);
  
  console.log('\nDeployment completed successfully! 🎉');
  console.log('Your custom app compiled files are now live on the "dist" branch.');
} catch (error) {
  console.error('\nDeployment failed:', error.message);
  process.exit(1);
}
