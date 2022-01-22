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
  agentId: 155, // to update the correct agent in database
  canvasDetails: [  
    { id: 1, background: BACKGROUND_1, json: "", qrcode: QrCodeSample, name: 'Wilker' },
    { id: 2, background: BACKGROUND_2, json: "", qrcode: "" },
    { id: 3, background: BACKGROUND_3, json: "", qrcode: QrCodeSample },
    { id: 4, background: BACKGROUND_4, json: "", qrcode: QrCodeSample }
  ],
}

```

# Features
1. Be saved in Database
2. Retrieve from server and Updatable
3. Save as Image & Pdf
4. Full Size of Pdf | Image ( A4, A5, Original )
5. Admin allow to create clipPath ( Phase 2 )
6. Admin allow to draw Circle & Rectangle image ( Phase 2 )
7. Drag and Drop ( Phase 2 )
