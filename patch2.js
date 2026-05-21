const fs = require('fs');
const file = 'pages/auth/verify-email.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'const { verifyEmailAndLogin } = useAuth();',
  'const auth = useAuth();\n  const { verifyEmailAndLogin } = auth;\n  console.log("auth keys:", Object.keys(auth));'
);
fs.writeFileSync(file, content);
