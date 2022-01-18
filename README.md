# How to Start
1. npm install
2. npm run start

# Values needed from Server
1. Name of the Agent
2. Id of the Agent
3. QrCode Image (png/jpg/base64)

# Expected format from Server
```javascript

const AGENT_INFO = {
  agentId: 155, // to update 
  canvasDetails: [
    /**
      1. status name field to track status
      2. 
    */
    { id: 1, background: BG_BASE64_1, json: "", qrcodeBase64: Qr_BASE64, profileStatus: false, name: 'Wilker' },
    { id: 2, background: BG_BASE64_2, json: "", qrcodeBase64: Qr_BASE64 },
    { id: 3, background: BG_BASE64_3, json: "", qrcodeBase64: Qr_BASE64 },
    { id: 4, background: BG_BASE64_4, json: "", qrcodeBase64: Qr_BASE64, avatarIsFull: false, avatars: [] }
  ],
}

```