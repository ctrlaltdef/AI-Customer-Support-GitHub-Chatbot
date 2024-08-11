'use client'
import { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

export default function Home() {
  const [messages, setMessages] = useState([
    { text: "Hi, I'm AmazonBot! How can I assist you today?", role: "bot", timestamp: new Date() }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState(null);
  const [error, setError] = useState(null);

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
    // Auto-scroll to the bottom when messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date()
      };

      // Add user's message to the chat
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      if (chat) {
        const promptWithRole = `
            Role: You are AmazonBot, an intelligent and reliable virtual assistant designed to support Amazon customers. 
            Your primary role is to assist users by providing accurate, concise, brief and helpful information related to Amazon products, order tracking, account management, and general inquiries about services. If they ask to give a detailed response
            then only give a long response.

            Tone: Friendly, helpful, and informative. Always aim to assist users efficiently and provide a positive shopping experience.

            Goals:
            - Understand Customer Intent: Accurately interpret customer questions and provide relevant responses or direct them to the appropriate resources.
            - Product Information: Provide details about products, including specifications, availability, and pricing.
            - Order Tracking: Help customers track their orders and provide updates on shipping status.
            - Account Management: Assist with account-related issues such as password resets, order history, and payment methods.
            - General Inquiries: Address a variety of general inquiries about Amazon's services, including returns, refunds, and delivery options.

            Knowledge Scope:
            - Product Information: Understand Amazon's product catalog, including categories, features, and availability.
            - Order Tracking: Provide information on how to track orders, estimated delivery times, and shipping methods.
            - Account Management: Help with account-related tasks such as updating personal information, managing payment methods, and resolving login issues.
            - General Services: Offer guidance on Amazon's services such as Prime membership, return policies, and customer support options.
            - Troubleshooting: Assist with resolving common issues related to shopping, orders, or account management.

            Limitations:
            - You do not have access to personal customer data or proprietary Amazon systems unless shared in the conversation.
            - You cannot directly modify orders or account settings; your role is advisory.
            - You should avoid offering legal or financial advice beyond the scope of Amazon's policies.

            Example Scenarios:
            - A customer needs help finding a specific product on Amazon.
            - A user wants to track their recent order and get shipping updates.
            - A customer needs assistance with a return or refund request.
            - A user is having trouble logging into their account and needs a password reset.
            - A customer is looking for information on Amazon Prime benefits and services.
          `;

        const result = await chat.sendMessage(`${promptWithRole}\n\n${userInput}`);
        const botMessage = result.response.text().replace(/\*/g, '');  // Remove asterisks from bot response

        // Prepare bot message for gradual display
        let displayedText = '';
        const finalBotMessage = { text: '', role: "bot", timestamp: new Date() };

        // Add initial empty bot message
        setMessages((prevMessages) => [...prevMessages, finalBotMessage]);

        // Simulate streaming by gradually revealing the bot's response
        for (let i = 0; i < botMessage.length; i++) {
          displayedText += botMessage[i];
          await new Promise(resolve => setTimeout(resolve, 5));  // Adjust the delay to control the speed
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...finalBotMessage,
              text: displayedText,
            };
            return updatedMessages;
          });
        }
      }
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

  const primary = "bg-gray-900";
  const secondary = "bg-gray-800";
  const accent = "bg-yellow-500";
  const text = "text-gray-100";

  return (
    <div className={`flex items-center justify-center bg-white h-screen`}>
      <div className={`w-full max-w-5xl ${primary} ${text} rounded-2xl shadow-lg h-[500px]`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className={`text-xl font-bold ${text}`}>AmazonBot</h1>
        </div>
        <div className={`overflow-y-auto ${secondary} scrollbar-hidden p-4 h-[calc(100%-96px)]`}>
          {messages.map((msg, index) =>
            <div
              key={index}
              className={`mb-6 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span className={`p-2 rounded-lg ${msg.role === "user" ? `${accent} text-white` : `${primary} ${text}`} max-w-4xl inline-block whitespace-pre-wrap`}>
                {msg.text}
              </span>
              <p className={`text-xs ${text} mt-1`}>
                {msg.role === "bot" ? "Bot" : "You"} - {" "}
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              <div ref={messageEndRef} /> 
            </div>
          )}
        </div>
        <div className="flex items-center border-t border-gray-700">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`flex-1 p-2 rounded-l-md border border-gray-600 ${primary} ${text} focus:outline-none focus:border-${accent}`}
          />
          <button
            onClick={handleSendMessage}
            className={`p-2 ${accent} text-white rounded-r-sm hover:bg-opacity-90 focus:outline-none h-[43px]`}
          >
            Send
          </button>
        </div>
        {error && <div className="text-red-500 text-sm p-4">{error}</div>}
      </div>
    </div>
  );
}
