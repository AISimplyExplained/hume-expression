"use client"

import React, { useState } from 'react'
import { Thread, useEdgeRuntime } from "@assistant-ui/react";
import { Bot, ChevronDown } from 'lucide-react';


type Props = {}

const Chatbot = (props: Props) => {
    const [isAssistantToggle, setIsAssistantToggle] = useState<boolean>(false);
  
    const runtime = useEdgeRuntime({
      api: "/api/chat",
    });

    return (
        <div className="fixed bottom-10 right-10 z-20">
            <div className={`bg-white border w-80 h-[400px] z-20 duration-100 ${isAssistantToggle ? "scale-100" : "scale-0"}`}>
                <Thread 
                    runtime={runtime} 
                    // welcome={{
                    //     suggestions: [
                    //     {
                    //         text: 'Could you answer this question',
                    //         prompt: 'Could you answer this question'
                    //     },
                    //     ]
                    // }}
                />
            </div>
            <div className="flex justify-end m-2">
                <div className="flex justify-center items-center cursor-pointer z-1 relative rounded-full bg-blue-700 size-12 active:scale-90 duration-100" onClick={() => setIsAssistantToggle(!isAssistantToggle)}>
                    {isAssistantToggle ? <ChevronDown color="white"/> : <Bot color="white"/>}
                </div>
            </div>
        </div>
    )
}

export default Chatbot