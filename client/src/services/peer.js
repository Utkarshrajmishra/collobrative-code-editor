class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      ans.type = "answer"; // Set the type to "answer"
      await this.peer.setLocalDescription(ans);
      return ans;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      const rtcSessionDescription = new RTCSessionDescription({
        type: ans.type,
        sdp: ans.sdp,
      });
      await this.peer.setLocalDescription(rtcSessionDescription);
    }
  }
  
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      offer.type = "offer"; // Set the type to "offer"
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }
}

export default new PeerService();
