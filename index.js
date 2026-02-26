import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ qr, connection }) => {
    if (qr) {
      console.log("Scan this QR:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("Connected!");

      const groups = await sock.groupFetchAllParticipating();

      console.log("YOUR GROUP LIST:");
      for (let id in groups) {
        console.log("Group Name:", groups[id].subject);
        console.log("Group ID:", id);
        console.log("-------------------------");
      }
    }
  });
}

startBot();
