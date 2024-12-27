class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          {
            urls: [
              "turn:global.relay.metered.ca:80",
              "turn:global.relay.metered.ca:80?transport=tcp",
            ],
            username: "94f3b47b75bce14a07250d90",
            credential: "lkVSrFEXW1s2GW3U",
          },
        ],
        iceCandidatePoolSize: 10,
      });

      this.peer.addEventListener("iceconnectionstatechange", () => {
        console.log("ICE connection state:", this.peer.iceConnectionState);
        if (this.peer.iceConnectionState === "failed") {
          this.peer.restartIce();
        }
      });
    }
  }

  async getAnswer(offer) {
    if (!this.peer) return null;
    try {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error in getAnswer:", error);
      throw error;
    }
  }

  async setLocalDescription(ans) {
    if (!this.peer) return;
    try {
      if (this.peer.signalingState === "have-local-offer") {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
    } catch (error) {
      console.error("Error in setLocalDescription:", error);
      throw error;
    }
  }

  async getOffer() {
    if (!this.peer) return null;
    try {
      const offer = await this.peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await this.peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error in getOffer:", error);
      throw error;
    }
  }
}

export default new PeerService();
