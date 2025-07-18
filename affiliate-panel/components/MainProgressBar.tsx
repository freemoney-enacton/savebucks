"use client";
import React, { useEffect } from "react";
// import { AppProgressBar } from "next-nprogress-bar";
import { ProgressProvider } from "@bprogress/next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "./ui/toaster";

// Custom hook to fix translation-related DOM issues
// const useTranslationFix = () => {
//   useEffect(() => {
//     // Save original DOM methods
//     const originalInsertBefore = Node.prototype.insertBefore;
//     const originalRemoveChild = Node.prototype.removeChild;
//     // Override insertBefore with a safer version
//     Node.prototype.insertBefore = function <T extends Node>(
//       newNode: T,
//       referenceNode: Node | null
//     ): T {
//       try {
//         // Check if referenceNode is a child of this node
//         if (referenceNode && !this.contains(referenceNode)) {
//           console.warn(
//             "Translation DOM fix: Attempting to insert before a node that is not a child"
//           );
//           return newNode; // Return the node without inserting to prevent error
//         }

//         // Call the original method if checks pass
//         return originalInsertBefore.call(this, newNode, referenceNode) as T;
//       } catch (error) {
//         console.warn(
//           "Translation DOM fix: Caught error during insertBefore",
//           error
//         );
//         return newNode;
//       }
//     };

//     // Override removeChild with a safer version
//     Node.prototype.removeChild = function <T extends Node>(childNode: T): T {
//       try {
//         // Check if childNode is actually a child of this node
//         if (!this.contains(childNode)) {
//           console.warn(
//             "Translation DOM fix: Attempting to remove a node that is not a child"
//           );
//           return childNode; // Return the node without removing to prevent error
//         }

//         // Call the original method if checks pass
//         return originalRemoveChild.call(this, childNode) as T;
//       } catch (error) {
//         console.warn(
//           "Translation DOM fix: Caught error during removeChild",
//           error
//         );
//         return childNode;
//       }
//     };

//     // Clean up on unmount
//     return () => {
//       Node.prototype.insertBefore = originalInsertBefore;
//       Node.prototype.removeChild = originalRemoveChild;
//     };
//   }, []);
// };

const MainProgressBar = ({ children }: any) => {
  return (
    <SessionProvider>
      <ProgressProvider
        height="3px"
        color="#B50A7B"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default MainProgressBar;
