'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Check, X as XIcon, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  username: string
  avatar: string | null
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string | null
  sender: User
  receiver: User | null
  createdAt: string
  isRead: boolean
}

interface ConversationParticipant {
  user: User
}

interface Conversation {
  id: string
  participants: ConversationParticipant[]
  messages: Message[]
  lastMessage?: Message
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestStatuses, setRequestStatuses] = useState<Record<string, 'pending' | 'accepted' | 'rejected'>>({})
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Загрузка текущего пользователя
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          // API возвращает { user: ... }, нужно извлечь user
          const user = data.user || data
          console.log('Текущий пользователь загружен:', user?.id, user?.username)
          if (user && user.id) {
            setCurrentUser(user)
          } else {
            console.error('Пользователь не имеет ID:', user)
            router.push('/login')
          }
        } else {
          console.error('Не удалось загрузить пользователя, статус:', response.status)
          router.push('/login')
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error)
        router.push('/login')
      }
    }
    fetchCurrentUser()
  }, [router])

  // Загрузка бесед
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setLoading(false)
      return
    }

    const fetchConversations = async () => {
      try {
        console.log('Загрузка бесед для пользователя:', currentUser.id)
        const response = await fetch(`/api/conversations?userId=${currentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Получены беседы:', data.length)
          setConversations(data)
          if (data.length > 0 && !selectedConversation) {
            setSelectedConversation(data[0])
          }
        } else {
          console.error('Ошибка загрузки бесед:', response.status)
        }
      } catch (error) {
        console.error('Ошибка загрузки бесед:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [currentUser?.id])

  // Обновление бесед при изменении
  useEffect(() => {
    if (!currentUser) return

    const interval = setInterval(async () => {
      if (!currentUser || !currentUser.id) return
      try {
        const response = await fetch(`/api/conversations?userId=${currentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
          // Обновляем выбранную беседу, если она есть
          if (selectedConversation) {
            const updated = data.find((c: Conversation) => c.id === selectedConversation.id)
            if (updated) {
              setSelectedConversation(updated)
            }
          }
        }
      } catch (error) {
        console.error('Ошибка обновления бесед:', error)
      }
    }, 3000) // Обновляем каждые 3 секунды

    return () => clearInterval(interval)
  }, [currentUser?.id, selectedConversation])

  // Загрузка статусов запросов для всех бесед
  useEffect(() => {
    if (!currentUser?.id || conversations.length === 0) return

    const fetchRequestStatuses = async () => {
      try {
        // Загружаем все запросы, где пользователь либо организатор, либо запросивший
        const response = await fetch(`/api/event-requests?userId=${currentUser.id}`)
        if (response.ok) {
          const allRequests = await response.json()
          const statusMap: Record<string, 'pending' | 'accepted' | 'rejected'> = {}
          
          // Проходим по всем беседам и их сообщениям
          conversations.forEach((conv) => {
            conv.messages.forEach((msg) => {
              const match = msg.content.match(/Запрос ID: (\w+)/)
              if (match) {
                const requestId = match[1]
                const request = allRequests.find((r: any) => r.id === requestId)
                if (request) {
                  statusMap[msg.id] = request.status
                }
              }
            })
          })
          
          setRequestStatuses(statusMap)
        }
      } catch (error) {
        console.error('Ошибка загрузки статусов запросов:', error)
      }
    }

    fetchRequestStatuses()
  }, [currentUser?.id, conversations])

  // Обработка принятия/отклонения запроса
  const handleRequestAction = async (messageId: string, action: 'accepted' | 'rejected') => {
    if (!currentUser) return

    // Извлекаем ID запроса из сообщения
    const message = selectedConversation?.messages.find((m) => m.id === messageId)
    if (!message) return

    const requestIdMatch = message.content.match(/Запрос ID: (\w+)/)
    if (!requestIdMatch) return

    const requestId = requestIdMatch[1]

    try {
      const response = await fetch(`/api/event-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          userId: currentUser.id,
        }),
      })

      if (response.ok) {
        // Обновляем локальный статус
        setRequestStatuses((prev) => ({
          ...prev,
          [messageId]: action,
        }))

        // Обновляем беседы
        const conversationsResponse = await fetch(`/api/conversations?userId=${currentUser.id}`)
        if (conversationsResponse.ok) {
          const data = await conversationsResponse.json()
          setConversations(data)
          
          // Обновляем текущую беседу (беседа с пользователем будет создана при клике на "Написать")
          const updated = data.find((c: Conversation) => c.id === selectedConversation?.id)
          if (updated) {
            setSelectedConversation(updated)
          }
        }
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при обработке запроса')
      }
    } catch (error) {
      console.error('Ошибка обработки запроса:', error)
      alert('Ошибка при обработке запроса')
    }
  }

  // Получение собеседника
  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUser) return null
    return conversation.participants.find((p: ConversationParticipant) => p.user.id !== currentUser.id)?.user || null
  }

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom()
    }
  }, [selectedConversation?.messages])

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser || sending) return

    setSending(true)
    try {
      const otherUser = getOtherParticipant(selectedConversation)
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: currentUser.id,
          receiverId: otherUser?.id || null,
          content: newMessage.trim(),
        }),
      })

      if (response.ok) {
        const sentMessage = await response.json()
        setNewMessage('')
        
        // Обновляем беседу с новым сообщением
        const updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, sentMessage],
        }
        setSelectedConversation(updatedConversation)
        
        // Обновляем список бесед
        const conversationsResponse = await fetch(`/api/conversations?userId=${currentUser.id}`)
        if (conversationsResponse.ok) {
          const updatedConversations = await conversationsResponse.json()
          setConversations(updatedConversations)
        }
        
        scrollToBottom()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при отправке сообщения')
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      alert('Ошибка при отправке сообщения')
    } finally {
      setSending(false)
    }
  }

  // Отметка сообщений как прочитанных
  useEffect(() => {
    if (!selectedConversation || !currentUser) return

    const markAsRead = async () => {
      try {
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: selectedConversation.id,
            userId: currentUser.id,
          }),
        })
      } catch (error) {
        console.error('Ошибка отметки сообщений как прочитанных:', error)
      }
    }

    markAsRead()
  }, [selectedConversation?.id, currentUser?.id])

  // Проверка, является ли сообщение запросом на участие
  const isEventRequestMessage = (message: Message) => {
    return message.content.includes('хочет присоединиться к вашему событию') && message.content.includes('Запрос ID:')
  }

  // Проверка, является ли сообщение ответом на запрос
  const isEventRequestResponse = (message: Message) => {
    return (message.content.includes('Запрос на участие принят') || message.content.includes('Запрос на участие отклонен')) && 
           (message.content.includes('✅') || message.content.includes('❌'))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Minimalist Sports Pattern Background (Telegram-style) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='sports' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='0.8' fill='%232F80ED' opacity='0.06'/%3E%3Ccircle cx='30' cy='10' r='0.8' fill='%232F80ED' opacity='0.06'/%3E%3Ccircle cx='10' cy='30' r='0.8' fill='%232F80ED' opacity='0.06'/%3E%3Ccircle cx='30' cy='30' r='0.8' fill='%232F80ED' opacity='0.06'/%3E%3Ccircle cx='20' cy='20' r='0.5' fill='%232F80ED' opacity='0.04'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23sports)'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat',
          backgroundColor: '#f9fafb',
        }}
      />
      <div className="relative z-10 flex w-full">
      {/* Left Sidebar Menu */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">SELS</h2>
        <nav className="space-y-2 flex-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Мой профиль
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Карта
          </Link>
          <Link
            href="/news"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            Новости
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            Поиск
          </Link>
          <Link
            href="/chats"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-[#2F80ED] rounded-xl font-medium"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            Чаты
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className={`w-80 bg-white border-r border-gray-200 flex flex-col transition-all ${
          selectedConversation ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Чаты</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Нет бесед</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation)
                const lastMessage = conversation.messages[conversation.messages.length - 1]
                const unreadCount = conversation.messages.filter(
                  (m) => !m.isRead && m.senderId !== currentUser?.id
                ).length

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#2F80ED] rounded-full flex items-center justify-center text-white font-bold">
                        {otherUser ? (
                          otherUser.avatar ? (
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.firstName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            `${otherUser.firstName[0]}${otherUser.lastName[0]}`
                          )
                        ) : (
                          '?'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Неизвестный'}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-[#2F80ED] text-white text-xs rounded-full px-2 py-1">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {lastMessage.content.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                  <div className="flex items-center gap-3 flex-1">
                    {(() => {
                      const otherUser = getOtherParticipant(selectedConversation)
                      return otherUser ? (
                        <>
                          <div className="w-10 h-10 bg-[#2F80ED] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {otherUser.avatar ? (
                              <img
                                src={otherUser.avatar}
                                alt={otherUser.firstName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              `${otherUser.firstName[0]}${otherUser.lastName[0]}`
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">
                              {otherUser.firstName} {otherUser.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">@{otherUser.username}</p>
                          </div>
                        </>
                      ) : (
                        <h2 className="text-lg font-bold text-gray-900">Беседа</h2>
                      )
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => {
                  const isOwn = message.senderId === currentUser?.id
                  const isRequest = isEventRequestMessage(message)
                  const isResponse = isEventRequestResponse(message)

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-4 ${
                          isOwn
                            ? 'bg-[#2F80ED] text-white'
                            : isRequest || isResponse
                            ? 'bg-[#E8F4FD] border-2 border-[#2F80ED]'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        {!isOwn && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#2F80ED] rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {message.sender.avatar ? (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.firstName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                `${message.sender.firstName[0]}${message.sender.lastName[0]}`
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {message.sender.firstName} {message.sender.lastName}
                            </span>
                          </div>
                        )}

                        {isRequest && (
                          <div className="mb-2">
                            <h3 className="font-bold text-gray-900 mb-2">Запрос на участие</h3>
                          </div>
                        )}

                        {isResponse && (
                          <div className="mb-2">
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                              {message.content.includes('✅') ? (
                                <>
                                  <Check size={20} className="text-green-500" />
                                  Запрос на участие принят
                                </>
                              ) : (
                                <>
                                  <XIcon size={20} className="text-red-500" />
                                  Запрос на участие отклонен
                                </>
                              )}
                            </h3>
                          </div>
                        )}

                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                        {/* Кнопка "Написать" для участника, когда запрос принят */}
                        {isResponse && !isOwn && message.content.includes('✅') && message.content.includes('принял') && (
                          <div className="mt-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 mb-3">
                              ✅ Ваш запрос принят! Теперь вы можете написать организатору
                            </div>
                            <button
                              onClick={async () => {
                                // Извлекаем username организатора из сообщения
                                const organizerMatch = message.content.match(/Пользователь (.+?) \(@(.+?)\)/)
                                if (!organizerMatch) return
                                
                                const organizerUsername = organizerMatch[2]
                                
                                // Ищем пользователя по username
                                try {
                                  const usersResponse = await fetch(`/api/users?username=${organizerUsername}`)
                                  if (!usersResponse.ok) {
                                    alert('Не удалось найти пользователя')
                                    return
                                  }
                                  
                                  const usersData = await usersResponse.json()
                                  const organizerUser = Array.isArray(usersData) ? usersData[0] : usersData
                                  
                                  if (!organizerUser || !organizerUser.id) {
                                    alert('Пользователь не найден')
                                    return
                                  }
                                  
                                  // Проверяем, есть ли уже беседа с этим пользователем
                                  let userConversation = conversations.find((c: Conversation) => {
                                    const otherUser = getOtherParticipant(c)
                                    const selsBot = c.participants.find((p: ConversationParticipant) => p.user.email === 'sels@system.com')
                                    // Это беседа между двумя пользователями (без SELS бота)
                                    return otherUser && otherUser.id === organizerUser.id && !selsBot
                                  })
                                  
                                  if (!userConversation) {
                                    // Создаем новую беседу
                                    try {
                                      const createResponse = await fetch('/api/conversations', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          userIds: [currentUser!.id, organizerUser.id],
                                        }),
                                      })
                                      
                                      if (createResponse.ok) {
                                        userConversation = await createResponse.json()
                                        // Обновляем список бесед
                                        const conversationsResponse = await fetch(`/api/conversations?userId=${currentUser!.id}`)
                                        if (conversationsResponse.ok) {
                                          const updatedConversations = await conversationsResponse.json()
                                          setConversations(updatedConversations)
                                          userConversation = updatedConversations.find((c: Conversation) => c.id === userConversation.id)
                                        }
                                      } else {
                                        const errorData = await createResponse.json()
                                        alert(errorData.error || 'Не удалось создать беседу')
                                        return
                                      }
                                    } catch (error) {
                                      console.error('Ошибка создания беседы:', error)
                                      alert('Ошибка при создании беседы')
                                      return
                                    }
                                  }
                                  
                                  if (userConversation) {
                                    setSelectedConversation(userConversation)
                                  }
                                } catch (error) {
                                  console.error('Ошибка при открытии беседы:', error)
                                  alert('Ошибка при открытии беседы')
                                }
                              }}
                              className="w-full py-2 px-4 bg-[#2F80ED] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                            >
                              Написать организатору
                            </button>
                          </div>
                        )}

                        {isRequest && !isOwn && message.content.includes('Запрос ID:') && (
                          <div className="mt-4">
                            {requestStatuses[message.id] === 'accepted' ? (
                              <div className="space-y-3">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                                  ✅ Вы приняли запрос на участие и можете написать пользователю
                                </div>
                                <button
                                  onClick={async () => {
                                    // Извлекаем username пользователя из сообщения
                                    const requesterMatch = message.content.match(/Пользователь (.+?) \(@(.+?)\)/)
                                    if (!requesterMatch) return
                                    
                                    const requesterUsername = requesterMatch[2]
                                    
                                    // Ищем пользователя по username
                                    try {
                                      const usersResponse = await fetch(`/api/users?username=${requesterUsername}`)
                                      if (!usersResponse.ok) {
                                        alert('Не удалось найти пользователя')
                                        return
                                      }
                                      
                                      const usersData = await usersResponse.json()
                                      const requesterUser = Array.isArray(usersData) ? usersData[0] : usersData
                                      
                                      if (!requesterUser || !requesterUser.id) {
                                        alert('Пользователь не найден')
                                        return
                                      }
                                      
                                      // Проверяем, есть ли уже беседа с этим пользователем
                                      let userConversation = conversations.find((c: Conversation) => {
                                        const otherUser = getOtherParticipant(c)
                                        const selsBot = c.participants.find((p: ConversationParticipant) => p.user.email === 'sels@system.com')
                                        // Это беседа между двумя пользователями (без SELS бота)
                                        return otherUser && otherUser.id === requesterUser.id && !selsBot
                                      })
                                      
                                      if (!userConversation) {
                                        // Создаем новую беседу
                                        try {
                                          const createResponse = await fetch('/api/conversations', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              userIds: [currentUser!.id, requesterUser.id],
                                            }),
                                          })
                                          
                                          if (createResponse.ok) {
                                            userConversation = await createResponse.json()
                                            // Обновляем список бесед
                                            const conversationsResponse = await fetch(`/api/conversations?userId=${currentUser!.id}`)
                                            if (conversationsResponse.ok) {
                                              const updatedConversations = await conversationsResponse.json()
                                              setConversations(updatedConversations)
                                              userConversation = updatedConversations.find((c: Conversation) => c.id === userConversation.id)
                                            }
                                          } else {
                                            const errorData = await createResponse.json()
                                            alert(errorData.error || 'Не удалось создать беседу')
                                            return
                                          }
                                        } catch (error) {
                                          console.error('Ошибка создания беседы:', error)
                                          alert('Ошибка при создании беседы')
                                          return
                                        }
                                      }
                                      
                                      if (userConversation) {
                                        setSelectedConversation(userConversation)
                                      }
                                    } catch (error) {
                                      console.error('Ошибка при открытии беседы:', error)
                                      alert('Ошибка при открытии беседы')
                                    }
                                  }}
                                  className="w-full py-2 px-4 bg-[#2F80ED] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                                >
                                  Написать
                                </button>
                              </div>
                            ) : requestStatuses[message.id] === 'rejected' ? (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                                ❌ Вы отклонили запрос на участие
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRequestAction(message.id, 'accepted')}
                                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                                >
                                  <Check size={18} />
                                  Принять
                                </button>
                                <button
                                  onClick={() => handleRequestAction(message.id, 'rejected')}
                                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
                                >
                                  <XIcon size={18} />
                                  Отклонить
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-xs mt-2 opacity-70">
                          {new Date(message.createdAt).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Напишите сообщение..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                      rows={1}
                      style={{
                        minHeight: '48px',
                        maxHeight: '120px',
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-[#2F80ED] text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Выберите беседу</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
