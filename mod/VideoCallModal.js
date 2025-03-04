"use client";
import { useEffect, useState, useRef } from "react";
import { getAblyClient } from "@/lib/ablyClient";
import useVideoCall from "@/hooks/useVideoCall";

export default function VideoCallModal({ currentUser, recipient, onClose }) {
    const {
        videoRef,
        remoteVideoRef,
        callAccepted,
        callRequest,
        isCalling,
        startCall,
        acceptCall,
        rejectCall,
        endCall
      } = useVideoCall(currentUser, recipient);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-3">{callAccepted ? "In Call" : "Calling..."}</h2>

        {/* Local Video */}
        <video ref={videoRef} autoPlay muted className="w-60 h-40 border" />

        {/* Remote Video */}
        {!callAccepted && <video ref={remoteVideoRef} autoPlay className="w-60 h-40 border mt-3" />}

        <div className="mt-3 flex gap-3">
          {!callAccepted && <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={acceptCall}>Accept</button>}
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>End Call</button>
        </div>
      </div>
    </div>
  );
}
