import { useWorkspaceName } from '../hooks/workspacehooks'
import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Clock, TrendingUp, FileText, CheckCircle2, Folder, AlertCircle } from 'lucide-react'
import { Button } from '../../Custom/ui/button'
import { Input } from '../../Custom/ui/input'
import {sendQuery} from "../apis/workspaceapis"
import { useMember } from '../../Member/hooks/memeberhooks'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TaskData {
  type: "task";
  title: string;
  dueDate: string | null;
  status: string;
  project: string;
}
// Parser function to format the message
const parseMessage = (message: string) => {
  const lines = message.split('\n');
  const parsed: TaskData[] = [];
  
  lines.forEach((line) => {
    if (line.startsWith('→')) {
      const content = line.substring(1).trim();
      
      // Check if it's a task line with metadata
      if (content.includes('(Due:') && content.includes('•')) {
        const parts = content.split('•').map(p => p.trim());
        const titlePart = parts[0];
        const status = parts[1];
        const project = parts[2];
        
        const titleMatch = titlePart.match(/\*\*(.*?)\*\*/);
        const dueDateMatch = titlePart.match(/\(Due: (.*?)\)/);
        
        parsed.push({
          type: 'task',
          title: titleMatch ? titleMatch[1] : titlePart,
          dueDate: dueDateMatch ? dueDateMatch[1] : null,
          status: status,
          project: project
        });
      } else {
        parsed.push({
          type: 'item',
          content: content
        });
      }
    } else {
      parsed.push({
        type: 'text',
        content: line
      });
    }
  });
  
  return parsed;
};

// Formatted message component
const FormattedMessage = ({ content }: { content: string }) => {
  const parsedContent = parseMessage(content);
  
  return (
    <div className="space-y-2">
      {parsedContent.map((item, index) => {
        if (item.type === 'text' && item.content) {
          return (
            <p key={index} className="text-sm font-medium mb-2">
              {item.content}
            </p>
          );
        }
        
        if (item.type === 'task') {
          return (
            <div key={index} className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.dueDate && (
                      <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">Due: {item.dueDate}</span>
                      </div>
                    )}
                    
                    {item.status && (
                      <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="font-medium">{item.status}</span>
                      </div>
                    )}
                    
                    {item.project && (
                      <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <Folder className="w-3 h-3" />
                        <span className="font-medium">{item.project}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        if (item.type === 'item' && item.content) {
          const isReason = item.content.toLowerCase().startsWith('reason:');
          
          return (
            <div key={index} className={`flex items-start gap-2 ${isReason ? 'mt-1' : ''}`}>
              <div className="mt-1.5">
                {isReason ? (
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                ) : (
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-1" />
                )}
              </div>
              <p className={`text-sm ${isReason ? 'text-amber-800 bg-amber-50 px-2 py-1 rounded-md font-medium' : 'text-gray-700'}`}>
                {item.content}
              </p>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default function RAG() {
  const member = useMember()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const name = useWorkspaceName()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sampleQueries = [
    {
      icon: FileText,
      text: 'What is my todo task',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      textColor: 'text-gray-800',
    },
    {
      icon: TrendingUp,
      text: 'Tell me the higher priority task',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      textColor: 'text-gray-800',
    },
    {
      icon: Clock,
      text: 'When tell latest assignments in my project',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      textColor: 'text-gray-800',
    },
  ]

  const handleSendMessage = async (query?: string) => {
    const messageText = query || inputValue
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    await sendQuery(member.name, query ?? inputValue).then((res) => {
      const rspMessage = res.data.message
      const messageAssistant: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: rspMessage,
        timestamp: new Date(),
      }
      setTimeout(()=>{
setMessages((prev) => [...prev, messageAssistant])
      setIsLoading(false)
      },1000)
      
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500">AI-Powered Task Assistant</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="mb-8 text-center space-y-6 py-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome to {name} workspace
              </h2>
              <p className="text-gray-600 text-lg">
                Ask me anything about your tasks, projects, and assignments
              </p>
            </div>

            <div className="grid gap-3 mt-10">
              {sampleQueries.map((query, index) => {
                const Icon = query.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(query.text)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${query.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors flex-shrink-0" />
                      <span className={`${query.textColor} font-medium group-hover:font-semibold`}>
                        {query.text}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Messages Area */}
        {messages.length > 0 && (
          <div className="space-y-4 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gray-900 text-white rounded-br-none'
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900 rounded-bl-none border border-blue-100'
                  }`}
                >
                  {message.type === 'assistant' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <span className={`text-xs mt-2 block ${message.type === 'user' ? 'opacity-60' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 w-full">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Ask me anything about your workspace..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendMessage()
                }
              }}
              disabled={isLoading}
              className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 rounded-xl"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}