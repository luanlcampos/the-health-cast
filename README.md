# Firebase backup Database In case shit hits the fan

## Three Files to keep in mind. Otherwise App will break

- .env.local    // ask Supriya if you want the backup firebase secret keys. This is the file you want if you want to login as HCP or end-user
- signUp page   // The code only breaks if you want to sign up as a HCP
- adminSecrets.json // Make sure you alter this if you want to sign in as admin as well

## Original adminSecrets.json

```
{
  "type": "service_account",
  "project_id": "authtest-5cf01",
  "private_key_id": "d9dc5bed4fd4bb84c37989ac78282ee28a813915",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCz3hc+fMJll8Pc\nDrVkWJDz5yfW21Oi05E5qfFjFfu76GNcVD91+Ua8reTdid0/x8A2P0RDlHLqhcVz\nVKNrLu6ZjrFNImDxJXZr6HbleoKeqXKJd1Eus6nzwnDUXZEgw/q895LcfJQbRPVg\nyJP2h9DLT4LtPf8focvYZP9Es+xV/1LvYcEwuyWIGWEhmMYYNe4+tES1YIGLJCaE\n2gvHLh24I/vfvETJt5BvfEmf/i08j3I55AjNFXWtwEGzmZ+HWwJN1z9xLAtUrdgv\n514ekfLEiyHf4qNWg3rrsmlS3b7+Sp1nCqdcBpU0oyQg+YhIUWKSgZXkI56UEOoL\nLrQYY1k5AgMBAAECggEAKOW/SESK2RnEfYVUpk/jCapOKzLslfHgLAnhqoOFnSjO\nauB3G4aGGIG7r8nYpldvc4Y4KduXs46eIkak78qYkw7Ybq759urrPcb6Pdx41cW2\nlt4r9eABLT1RdWAfDyGwogXy/TJQZNDtsEd7KUuhZJEcNoBpwZIC7R2t0zvL6ZOG\nZDycdyBtKbL/0lnYXJjN6z5gHlqYhVfE/FtpSqe3StGo8wN/DPqsaWUMCvXQVWFU\n86EtCgkyQ+Ja1kGwVaovdx8YiiEHkwvQM6eTNk5AtuqPGEm+BWVgwnTTSsSKw76h\neZHCv9UyYoPGOcq26SO+3lVoaHKFXW4nIznxWsjwuQKBgQDgYtH5HurfekOa/XhH\n8gDzkvnNYkn8cNDpTqaLkqXRBoCvbpyFgcplDSGyzz1dlmxmtu1fAGFCKxwWhCtn\nZ2pqR0OSAX9CPCs0uPiD8SVtiYqlf62R9mf9ANQyeQkP7yoXAuVYZy3Pw0HDTpnJ\nUnRSWwj5SRjetg/uKskHDVbkvQKBgQDNNZLEbGcfJiH0vjcj6Ax6cT6PvcKgSCV8\nCO9dS5zoQxa5EJOG9V3Z/shFx5uJAyBm95n1vOUN8i1PBQ6SKAW9U146t2XoeQbL\nxtsUuiZ0HedcVILIU25AVyhL5xrTu3tiKjH/ox3HCXV/9VxtRBIHDNF+hKzvgblV\n8Sm32o30LQKBgQDRryce0SiVnBCvNqx/NwRymed8aZxQHjDrxUbXaTwxIA2DYy87\nh7VWRzY1fXqQCXDVb55Ux+sbRWPjGrHg2IBWPrBDMcj1YXrSswPxcJkUSpLY436U\nxxoYEP07CWZRkKLZjCg8O3dRDttWow4NV1NCXrX9FrT58lLisvLW9z07VQKBgFnI\nsNhkHZJRWtX8S5/YLW19EsRNYFREfLISLriBFrvAbra1+/Y2cMOqZ/Gv7es6hPjI\nKIKODSHW7d/+9GsaO7ikOzwxddMK8OBDtyMQdzaixtFs4HPJnRlliOn8yY4OH2PJ\n1mpk8ehdyR0dOz1LZR/UiexzHD8GYRKrG3enlihZAoGAVpZFoLKAQmPOf2DImtJp\nWgbb6oEG+TCLwTYdvMPNnsucrD/qBpViTicBCNMWWJaauucHM3Ab058d8wibBrSf\nVIqMocL0N6BhTUTeSxLhyVONzB5nUI4/ZbK+CpP0EX0oBvHHwVjyKxQ34UoWDFfP\nyN+F58FSgXsW6VNjlqizyUY=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-kx6ng@authtest-5cf01.iam.gserviceaccount.com",
  "client_id": "107211794325491415832",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kx6ng%40authtest-5cf01.iam.gserviceaccount.com"
}
```

## Modiefied adminSecrets.json

```
{
  "type": "service_account",
  "project_id": "the-health-cast-backup",
  "private_key_id": "f5558c02d4834badbd9fa04a631e6dcf863d5ec3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC98sMOUovjmbrw\nZ5YprYHHLrzTNhlOPjlSenoJZrbAEBjnp3TeD1sKC3UNMG42iRBXT4QBPTar+ck3\nHBYnOiLREvwI+6gDEIPFeCEl849BiHy1oLC7k/z0qVtmhTdJYu4SqPkLstXdlwMn\n43rmmT0eUJDQCh9bI68t+uiGd8JFqgylVoFkSKN3sbOSTrXEKoyBqqCNHOdWjihu\nNQp2rn5FQzZE6/WopS4blrcDU5Cx6tYx+QoI3+FJXdF+98JCBBKkVAk1jBEdvhrC\nYIt49TP10+q6TaQoJ8B36H6Lq/neOvD2c0SjJUQd9v8s6jK4OzE0/f3xpJmldudW\nsN92v091AgMBAAECggEAAxFM2DNDJZZwl/eJcFLxaCPnjbE9Jk/eup6ohvSOF6QI\noBMc/6oTCRA+O7lnCkGkfAYzwbrwBsXo0mCOfghUNvj0xB2omrYQvrkgLxBBkzFB\nMzHa1WQbnynATapxvPOPTzdWcpbh9PRsNDtQ//oEfn0WYjCUzY4tcK7WDUornukn\nPyvQNdLQif4xUsbt3HBnMS6H53f32jb3Orc9Uk9mx6t9bnkzusujdKXNo5MLeSFG\ndYMGRtixhGRr4IkKCQV989EUELIriwDj+fEyle2Z7Tjp/Zc1ZIH7mBE8LsjQzSGO\nkTR2XzzmABZiB0FPCfxe5wv1teBc3l79jsOrbSTKUQKBgQDqWEf3LKA9htxPY+DO\nSoSdPJ6SaWfMZziXfVHnrbYSzYz5hweMe9HKIh4CqwITK9GrJP/OH6/db5SwG8Hl\nMk/caG8hYY2whSlsTEwduJItEQtHtJxNq2uFMCuZVT8m4XdLj7u69XaX2h2GY0h/\nQHxDUDjuLPo6Lq0f3DuF/cTxkQKBgQDPgDmYvXYNVvYofQwOy272ZKcsDfPChzLe\n13aVve/fMl3H9YAEhUoOcfvweOAVBFc9XSRogf3MWp3qkeMHoCHJvzeCSTq6ZM0C\nS2X+peqo2LYQg2TtIeXRe1nE8X2jxiA6Yqz2iOUZD5bb2IDUa9aFnPdB/0SqSRCC\nu4dQhDdNpQKBgFiL8O1RXF7DJV2OFLR97avn6tbRoxnV6sk63gbXWVOzfVAPmGeZ\npYRl7cb+TLNnvDqZqVp+GJpn/dupMVNj9k8G2u7XCI2pUySLk7srMXh71zJJ6UFj\nwyW5NNAkKM+NI+FWNw4Gj8AC92L/AraqbAmXN1uvfQEc/+do9MjFQXQxAoGAZWZJ\nvyRGvjoSzLJe5BPxw6JoNxUSW6tp5o/wOTi6MZ4RShfkWVExYWG+NkM7bcnTP/92\nPUPY3LYjmW91PFK6cDZrT9WtR0zfChICY7B8vco5HlS3S1JXVkkrExzXwuKc+Ssj\nTs6S9e4yUHi6bBPOnziXc77ktTpDQT+W3nfd9qkCgYBsy3MCDQ+zbjeVmPCQAIFr\n+3pDnJ+6fplMyHw43ZUWYKCzb36G201gyo7PbSoOyG7J3inBZjfP9dG6mZGdDOp/\n3qsY1H1u50jqC8nHGL68W5nsDXnVGMUrzSgUTTMdYmOcz+SM7iOa+nW7EH54LF/p\nYcg3FPWCRk0Olii3CN3PMw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-a7yml@the-health-cast-backup.iam.gserviceaccount.com",
  "client_id": "102138577921422752616",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-a7yml@the-health-cast-backup.iam.gserviceaccount.com"
}

```

## Original Sign Up Page --> Replace the OrgOptions Object

```
const orgOptions = [
  {
    value: {
      orgId: "9YZYr2AsJWbZ1Qvv2u6l0DA6Hcl1",
      orgName: "Public Health Ontario",
    },
    label: "Public Health Ontario",
  },
  {
    value: {
      orgId: "wCJ8h7jdDiX7OZHpxveGp0jdewP2",
      orgName: "Doctors Without Borders",
    },
    label: "Doctors Without Borders",
  },
];
```

## Modified Sign Up Page --> Replace the OrgOptions Object

```
const orgOptions = [
  {
    value: {
      orgId: "9YZYr2AsJWbZ1Qvv2u6l0DA6Hcl1",
      orgName: "Public Health Ontario",
    },
    label: "Public Health Ontario",
  },
  {
    value: {
      orgId: "VyiGr2kUCWYXzH7P0ptS",
      orgName: "Doctors Without Borders",
    },
    label: "Doctors Without Borders",
  },
```

# The Health Cast App Repo

## Running Server locally

After cloning the repo, you should run the following commands:

```
cd server
npm install
npm start or npm run dev if you want to run the app in development mode using nodemon.
```

## Running UI locally

After cloning the repo, you should run the following commands:

```
cd client
npm install
npm start or npm run dev if you want to run the app in development mode.
```
