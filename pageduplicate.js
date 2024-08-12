// 'use client'
// import { useState, useEffect, useRef } from "react";
// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from '@google/generative-ai';
// import { fetchGitHubData } from '../utils/github';
// import useSpeechToText from "./hooks/useSpeechToText";

// export default function Home() {
//   const [messages, setMessages] = useState([
//     { text: "Hi, I'm GitBot! Your virtual Git assistant. How can I assist you today?\nTo search for a repository on Github preface your prompt with 'find repository:' followed by what you are looking for.", role: "bot", timestamp: new Date() }
//   ]);
//   const [userInput, setUserInput] = useState("");
//   const [chat, setChat] = useState(null);
//   const [error, setError] = useState(null);
//   const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true })
//   const startStopListening = () => { isListening ? stopVoiceInput() : startListening() }

//   const stopVoiceInput = () => {
//     setUserInput(prevVal => prevVal + (transcript.length ? (prevVal.length ? " " : "") + transcript : ""))
//     stopListening()
//   }


//   const messageEndRef = useRef(null);
//   const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
//   const MODEL_NAME = "gemini-1.5-flash";
//   const genAI = new GoogleGenerativeAI(API_KEY);

//   const generationConfig = {
//     temperature: 0.9,
//     topK: 1,
//     topP: 1,
//     maxOutputTokens: 2048,
//   };

//   const safetySettings = [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//   ];

//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         const newChat = await genAI
//           .getGenerativeModel({ model: MODEL_NAME })
//           .startChat({
//             generationConfig,
//             safetySettings,
//           });
//         setChat(newChat);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
//     initChat();
//   }, []);

//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);
// ;

//   const handleSendMessage = async () => {
//     try {
//       // Add user message to the messages state
//       const userMessage = {
//         text: userInput,
//         role: "user",
//         timestamp: new Date()
//       };
    
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setUserInput("");
    
//       let botMessage = '';
    
//       if (userInput.toLowerCase().includes("find repository:") || userInput.toLowerCase().includes("find repositories:")) {
//         const githubData = await fetchGitHubData(userInput);
    
//         if (githubData.items && githubData.items.length > 0) {
//           botMessage = `Here are some GitHub repositories related to your query:\n\n${githubData.items.map(repo => `- ${repo.full_name}: ${repo.html_url}`).join('\n')}`;
//         } else {
//           botMessage = "I couldn't find any relevant repositories on GitHub.";
//         }
//       } else {
//         // Use Google Gen-AI for non-GitHub-related queries
//         if (chat) {
//           const promptWithRole = `
//             Role: You are GitBot, an intelligent and reliable virtual assistant designed to assist with information related to Git repositories, version control, and general programming inquiries. 
//             Your primary role is to assist users by providing accurate, concise, brief and helpful information related to Git commands, repository management, version control best practices, and general programming help. If they ask to give a detailed response
//             then only give a long response.
  
//             Tone: Friendly, helpful, and informative. Always aim to assist users efficiently and provide a positive experience.
  
//             Goals:
//             - Understand User Intent: Accurately interpret user questions and provide relevant responses or direct them to the appropriate resources.
//             - Git Commands: Provide details about Git commands, their usage, and examples.
//             - Repository Management: Assist with managing Git repositories, including cloning, branching, merging, and pushing changes.
//             - Version Control: Explain concepts related to version control, such as commits, branches, and merges.
//             - General Programming Help: Offer guidance on programming issues or questions related to version control.
  
//             Knowledge Scope:
//             - Git Commands: Understand commonly used Git commands, their options, and syntax.
//             - Repository Management: Provide instructions on managing Git repositories, including setting up remote repositories and handling conflicts.
//             - Version Control: Explain core concepts of version control, including commits, branches, merges, and rebases.
//             - General Programming: Offer assistance with programming-related questions that intersect with version control.
  
//             Limitations:
//             - You do not have access to private user data or specific repository details unless shared in the conversation.
//             - You cannot directly execute Git commands or modify repositories; your role is advisory.
//             - You should avoid offering advanced programming or Git-related advice beyond the scope of general best practices.
  
//             Example Scenarios:
//             - A user needs help with a specific Git command or its syntax.
//             - A user wants guidance on how to resolve a Git merge conflict.
//             - A user needs help with setting up a remote Git repository.
//             - A user has a question about best practices for managing branches in Git.
//             - A user is looking for advice on version control strategies for a programming project.
//           `;
    
//           const result = await chat.sendMessage(`${promptWithRole}\n\n${userInput}`);
//           botMessage = result.response.text().replace(/\*/g, '');
//         }
//       }
  
//       // Add the bot message to the messages state
//       const finalBotMessage = { text: '', role: "bot", timestamp: new Date() };
//       setMessages((prevMessages) => [...prevMessages, finalBotMessage]);
  
//       // Function to handle typing effect
//       const handleTypingEffect = async () => {
//         let displayedText = '';
//         for (let i = 0; i < botMessage.length; i++) {
//           displayedText += botMessage[i];
//           await new Promise(resolve => setTimeout(resolve, 5));
//           setMessages((prevMessages) => {
//             const updatedMessages = [...prevMessages];
//             updatedMessages[updatedMessages.length - 1] = {
//               ...finalBotMessage,
//               text: displayedText,
//             };
//             return updatedMessages;
//           });
//         }
//       };
  
//       // Start typing effect
//       handleTypingEffect();
//     } catch (err) {
//       setError(err.message);
//     }
//   };
  
  
  
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const primary = "bg-gray-900";
//   const secondary = "bg-gray-800";
//   const accent = "bg-yellow-500";
//   const text = "text-gray-100";

//   return (
//     <div className={`flex items-center justify-center bg-white h-screen`} >
//       <div className={`w-full max-w-5xl ${primary} ${text} rounded-2xl shadow-lg h-[500px]`}>
//         <div className="flex justify-between items-center p-4 border-b border-gray-700">
//           <h1 className={`text-xl font-bold ${text}`}>GitBot</h1>
//         </div>
//         <div className={`overflow-y-auto ${secondary} scrollbar-hidden p-4 h-[calc(100%-96px)]`}>
//           {messages.map((msg, index) =>
//             <div
//               key={index}
//               className={`mb-6 ${msg.role === "user" ? "text-right" : "text-left"}`}
//             >
//               <span className={`p-2 rounded-lg ${msg.role === "user" ? `${accent} text-white` : `${primary} ${text}`} max-w-4xl inline-block whitespace-pre-wrap`}>
//                 {msg.text}
//               </span>
//               <p className={`text-xs ${text} mt-1`}>
//                 {msg.role === "bot" ? "Bot" : "You"} - {" "}
//                 {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
//               </p>
//               <div ref={messageEndRef} /> 
//             </div>
//           )}
//         </div>
//         <div className="flex items-center border-t border-gray-700">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             disabled={isListening}
//             value={isListening ? userInput + (transcript.length ? (userInput.length ? " " : "") + transcript : "") : userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//             className={`flex-1 p-2 rounded-l-md border border-gray-600 ${primary} ${text} focus:outline-none focus:border-${accent}`}
//           />
//           <button
//             className={`p-2 mr-2 ${isListening ? "bg-black" : "bg-yellow-500"} rounded-sm focus:outline-none h-[43px]`}
//             onClick={() => { startStopListening() }}
//           >
//             {isListening ? "Stop 🟥 " : "Speak 🎤"}
//           </button>
//           <button
//             onClick={handleSendMessage}
//             className={`p-2 ${accent} text-white rounded-r-sm hover:bg-opacity-90 focus:outline-none h-[43px]`}
//           >
//             Send
//           </button>
//         </div>
//         {error && <div className="text-red-500 text-sm p-4">{error}</div>}
//       </div>
//     </div>
//   );
// }


'use client'
import { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { fetchGitHubData } from '../utils/github';
import useSpeechToText from "./hooks/useSpeechToText";
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

export default function Home() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm GitBot, your AI assistant for Git and GitHub queries. Let me know how I can assist you today! For repo searches, just include 'find repository' in your prompt.", role: "bot", timestamp: new Date() }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState(null);
  const [error, setError] = useState(null);
  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true })
  const startStopListening = () => { isListening ? stopVoiceInput() : startListening() }

  const stopVoiceInput = () => {
    setUserInput(prevVal => prevVal + (transcript.length ? (prevVal.length ? " " : "") + transcript : ""))
    stopListening()
  }


  const messageEndRef = useRef(null);
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const MODEL_NAME = "gemini-1.5-flash";
  const genAI = new GoogleGenerativeAI(API_KEY);

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = await genAI
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            generationConfig,
            safetySettings,
          });
        setChat(newChat);
      } catch (err) {
        setError(err.message);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  ;

  const handleSendMessage = async () => {
    try {
      // Add user message to the messages state
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date()
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      let botMessage = '';

      if (userInput.toLowerCase().includes("find repository") || userInput.toLowerCase().includes("find repositories")) {
        const githubData = await fetchGitHubData(userInput);

        if (githubData.items && githubData.items.length > 0) {
          botMessage = `Here are some GitHub repositories related to your query:\n\n${githubData.items.map(repo => `- ${repo.full_name}: ${repo.html_url}`).join('\n')}`;
        } else {
          botMessage = "I couldn't find any relevant repositories on GitHub.";
        }
      } else {
        // Use Google Gen-AI for non-GitHub-related queries
        if (chat) {
          const promptWithRole = `
            Role: You are GitBot, an intelligent and reliable virtual assistant designed to assist with both Git and GitHub-related queries. 
            Your primary role is to help users by providing accurate, concise, and helpful information on Git commands, repository management, version control best practices, GitHub repository searches, and general programming inquiries.

            Tone: Friendly, helpful, and informative. Always aim to assist users efficiently and provide a positive experience.

            Goals:
            - Understand User Intent: Accurately interpret user questions and provide relevant responses or direct them to the appropriate resources.
            - Git Commands: Provide details about Git commands, their usage, and examples.
            - Repository Management: Assist with managing Git repositories, including cloning, branching, merging, and pushing changes.
            - Version Control: Explain concepts related to version control, such as commits, branches, and merges.
            - GitHub Assistance: Help users find repositories on GitHub and provide guidance on using GitHub features.
            - General Programming Help: Offer guidance on programming issues or questions related to version control and Git/GitHub usage.

            Knowledge Scope:
            - Git Commands: Understand commonly used Git commands, their options, and syntax.
            - Repository Management: Provide instructions on managing Git repositories, including setting up remote repositories and handling conflicts.
            - Version Control: Explain core concepts of version control, including commits, branches, merges, and rebases.
            - GitHub Assistance: Help users with GitHub-specific queries, such as repository searches, pull requests, and issue management.
            - General Programming: Offer assistance with programming-related questions that intersect with version control and Git/GitHub usage.

            Limitations:
            - You do not have access to private user data or specific repository details unless shared in the conversation.
            - You cannot directly execute Git commands or modify repositories; your role is advisory.
            - You should avoid offering advanced programming or Git-related advice beyond the scope of general best practices.

            Example Scenarios:
            - A user needs help with a specific Git command or its syntax.
            - A user wants guidance on how to resolve a Git merge conflict.
            - A user needs help with setting up a remote Git repository.
            - A user wants to search for repositories on GitHub.
            - A user has a question about best practices for managing branches in Git.
            - A user is looking for advice on version control strategies for a programming project.
            `;


          const result = await chat.sendMessage(`${promptWithRole}\n\n${userInput}`);
          botMessage = result.response.text().replace(/\*/g, '');
        }
      }

      // Add the bot message to the messages state
      const finalBotMessage = { text: '', role: "bot", timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, finalBotMessage]);

      // Function to handle typing effect
      const handleTypingEffect = async () => {
        let displayedText = '';
        for (let i = 0; i < botMessage.length; i++) {
          displayedText += botMessage[i];
          await new Promise(resolve => setTimeout(resolve, 5));
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...finalBotMessage,
              text: displayedText,
            };
            return updatedMessages;
          });
        }
      };

      // Start typing effect
      handleTypingEffect();
    } catch (err) {
      setError(err.message);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const primary = "bg-[#00000a]";
  const secondary = "bg-[#05001b]";
  const accent = "bg-[#6f88a1]";
  const textPrimary = "text-[#FFFFFF]";
  const textSecondary = "text-[#999999]";

  return (
    <div className={`flex items-center justify-center bg-white h-screen`}>
      <div className={`w-1/2 max-w-5xl ${secondary} ${textPrimary} rounded-lg shadow-lg h-[400px]`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className={`text-2xl font-bold ${textPrimary}`}>GitBot</h1>
        </div>
        <div className={`overflow-y-auto p-4 h-[calc(100%-96px)]`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-6 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`p-3 rounded-lg ${msg.role === "user" ? `${accent} ${textPrimary}` : `${accent} ${textPrimary}`} max-w-4xl inline-block whitespace-pre-wrap`}
              >
                {msg.text}
              </span>
              <p className={`text-xs ${textSecondary} mt-1`}>
                {msg.role === "bot" ? "Bot" : "You"} -{" "}
                {msg.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              <div ref={messageEndRef} />
            </div>
          ))}
        </div>
        <div className={`flex items-center `}>
          <input
            type="text"
            placeholder="Type your message..."
            disabled={isListening}
            value={isListening ? userInput + (transcript.length ? (userInput.length ? " " : "") + transcript : "") : userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`flex-1 p-3 rounded-l-md border ${primary} ${textPrimary} focus:outline-none focus:border-${accent}`}
          />
          <div className={`flex justify-center items-center p-2 rounded-r-md border ${primary} ${textPrimary}`}>
            <button
              className={`p-2 mr-3 ml-2 ${isListening ? "bg-red-600" : `${accent}`} rounded-full focus:outline-none h-[32px]`}
              onClick={() => startStopListening()}
            >
              <FaMicrophone className={`${textPrimary}`} />
            </button>
            <button
              onClick={handleSendMessage}
              className={`p-2 ${accent} ${textPrimary} mr-3 rounded-full hover:bg-opacity-90 focus:outline-none h-[32px]`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm p-4">{error}</div>}
      </div>
    </div>
  );
}
