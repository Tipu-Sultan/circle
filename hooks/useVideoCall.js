"use client";
import { useEffect, useState, useRef } from "react";
import { getAblyClient } from "@/lib/ablyClient";
import SimplePeer from "simple-peer";

export default function useVideoCall(currentUser, recipient, onClose) {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRequest, setCallRequest] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const [incomingSignal, setIncomingSignal] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  const videoRef = useRef();
  const remoteVideoRef = useRef();

  const client = getAblyClient(currentUser.id);
  const channelName = [`video-call`, currentUser.id, recipient.id].sort().join("-");
  const channel = client.channels.get(channelName);

  // Get camera & mic permissions
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));

    return () => endCall(); // Cleanup on unmount
  }, []);

  // Listen for incoming call requests
  useEffect(() => {
    channel.subscribe("call-offer", ({ data }) => {
      console.log("Incoming call offer:", data);
      setCallRequest(true);
      setCallerId(data.sender);
      setIncomingSignal(data.signal);
    });

    channel.subscribe("call-answer", ({ data }) => {
      console.log("Call answered:", data);
      if (peer) peer.signal(data.signal);
    });

    channel.subscribe("call-ended", () => {
      console.log("Call ended by other user");
      endCall();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [channel, peer]);

  // **Start the call**
  const startCall = () => {
    console.log("Starting call...");
    setIsCalling(true);

    const newPeer = new SimplePeer({ initiator: true, trickle: false, stream });

    newPeer.on("signal", (data) => {
      console.log("Sending call offer...");
      channel.publish("call-offer", { sender: currentUser.id, signal: data });
    });

    newPeer.on("stream", (remoteStream) => {
      console.log("Receiving remote stream...");
      setRemoteStream(remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
      setCallAccepted(true);
    });

    setPeer(newPeer);
  };

  // **Accept the call**
  const acceptCall = () => {
    console.log("Accepting call...");
    setIsCalling(true);

    const newPeer = new SimplePeer({ initiator: false, trickle: false, stream });

    newPeer.signal(incomingSignal);

    newPeer.on("signal", (data) => {
      console.log("Sending call answer...");
      channel.publish("call-answer", { sender: currentUser.id, signal: data });
    });

    newPeer.on("stream", (remoteStream) => {
      console.log("Receiving remote stream...");
      setRemoteStream(remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
      setCallAccepted(true);
    });

    setPeer(newPeer);
    setCallRequest(false);
  };

  // **Reject the call**
  const rejectCall = () => {
    console.log("Rejecting call...");
    channel.publish("call-ended", {});
    setCallRequest(false);
  };

  // **End the call**
  const endCall = () => {
    console.log("Ending call...");
    if (peer) peer.destroy();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setPeer(null);
    setStream(null);
    setRemoteStream(null);
    setCallAccepted(false);
    setCallRequest(false);
    setIsCalling(false);
    channel.publish("call-ended", {});
    onClose();
  };

  return {
    videoRef,
    remoteVideoRef,
    callAccepted,
    callRequest,
    isCalling,
    startCall,
    acceptCall,
    rejectCall,
    endCall
  };
}
