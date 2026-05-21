const fs = require('fs');
const file = 'pages/auth/verify-email.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ??
          "Verification failed. The link may have expired.";`,
  `        const msg =
          (err as { message?: string })?.message ??
          "Verification failed. The link may have expired.";`
);
fs.writeFileSync(file, content);
