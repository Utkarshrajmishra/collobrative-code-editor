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
          
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "94f3b47b75bce14a07250d90",
            credential: "lkVSrFEXW1s2GW3U",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "94f3b47b75bce14a07250d90",
            credential: "lkVSrFEXW1s2GW3U",
          },
                  ],
      });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      try {
        // First set remote description
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));

        // Then create and set local description
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);

        return answer;
      } catch (error) {
        console.error("Error in getAnswer:", error);
        throw error;
      }
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      try {
        // Only proceed if we're in a valid state to receive an answer
        if (this.peer.signalingState === "have-local-offer") {
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        } else {
          console.warn(
            `Invalid state for setting remote answer: ${this.peer.signalingState}`
          );
        }
      } catch (error) {
        console.error("Error in setLocalDescription:", error);
        throw error;
      }
    }
  }

  async getOffer() {
    if (this.peer) {
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
}

export default new PeerService();
