const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input img");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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"; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message,className) => {
    // Create a chat <li> element with passed message and className
   const chatLi = document.createElement("li");
   chatLi.classList.add("chat",className);
   let chatContent = className === "outgoing" ? `<p></p>` : `<img class="material-symbols-outlined" src="/portfolio/chatbot.png" alt=""><p></p>`;
   chatLi.innerHTML = chatContent;
   chatLi.querySelector("p").textContent = message;
   return chatLi;
  }

const generateResponse = (incomingChatLi) => {
   const API_URL = "https://api.openai.com/v1/chat/completions";
   const messageElement = incomingChatLi.querySelector("p");

   const requestOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: userMessage}]
    })
   }

   // Send POST request to API, get response
   fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
    messageElement.textContent = data.choices[0].message.content;
   }).catch((error) => {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
   }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
   userMessage = chatInput.value.trim();
   if(!userMessage) return;
   chatInput.value = "";
   chatInput.style.height = `${inputInitHeight}px`;

   // Append the user message to the chatbox
   chatbox.appendChild(createChatLi(userMessage,"outgoing"));
   chatbox.scrollTo(0, chatbox.scrollHeight);

   setTimeout(() => {
    //Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...","incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
   },600);
}  

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
