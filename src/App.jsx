import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Load tasks from cookies on initial render
  useEffect(() => {
    const savedTasks = Cookies.get('todo-tasks')
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        setTasks(parsedTasks)
      } catch (error) {
        console.error('Failed to parse tasks from cookies:', error)
      }
    }
  }, [])

  // Save tasks to cookies whenever tasks change
  useEffect(() => {
    Cookies.set('todo-tasks', JSON.stringify(tasks), { expires: 365 })
  }, [tasks])

  // Add new task
  const addTask = () => {
    if (inputValue.trim() === '') return
    
    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setTasks([...tasks, newTask])
    setInputValue('')
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Start editing
  const startEdit = (task) => {
    setEditingId(task.id)
    setEditValue(task.text)
  }

  // Save edit
  const saveEdit = () => {
    if (editValue.trim() === '') return
    
    setTasks(tasks.map(task => 
      task.id === editingId ? { ...task, text: editValue.trim() } : task
    ))
    setEditingId(null)
    setEditValue('')
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  // Handle edit key press
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  // Clear all completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length
  const pendingCount = totalCount - completedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Мастер Задач
          </h1>
          <p className="text-slate-400 text-lg">Организуйся, выполняй дела</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Что нужно сделать?"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
              <button
                onClick={addTask}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-medium transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Plus size={20} />
                Добавить
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {totalCount > 0 && (
            <div className="px-6 py-3 bg-white/5 flex items-center justify-between text-sm">
              <div className="flex gap-4 text-slate-400">
                <span><span className="text-cyan-400 font-semibold">{totalCount}</span> всего</span>
                <span><span className="text-purple-400 font-semibold">{pendingCount}</span> в процессе</span>
                <span><span className="text-pink-400 font-semibold">{completedCount}</span> выполнено</span>
              </div>
              {completedCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-slate-400 hover:text-pink-400 transition-colors"
                >
                  Очистить выполненные
                </button>
              )}
            </div>
          )}

          {/* Task List */}
          <div className="max-h-[500px] overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg">Пока нет задач</p>
                <p className="text-slate-500 text-sm mt-1">Добавь свою первую задачу выше, чтобы начать</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`group flex items-center gap-3 p-4 hover:bg-white/5 transition-all ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400'
                          : 'border-slate-500 hover:border-purple-400'
                      }`}
                    >
                      {task.completed && <Check size={14} className="text-white" />}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      {editingId === task.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyPress}
                          onBlur={saveEdit}
                          autoFocus
                          className="w-full bg-white/10 border border-purple-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      ) : (
                        <span
                          onClick={() => toggleTask(task.id)}
                          className={`block cursor-pointer truncate ${
                            task.completed
                              ? 'line-through text-slate-500'
                              : 'text-white'
                          }`}
                        >
                          {task.text}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === task.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(task)}
                            className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-pink-400 hover:bg-pink-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {totalCount > 0 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-center text-slate-500 text-sm">
              {pendingCount === 0 ? (
                <span className="text-green-400">Все задачи выполнены!</span>
              ) : (
                <span>Осталось {pendingCount} {pendingCount === 1 ? 'задача' : pendingCount < 5 ? 'задачи' : 'задач'}</span>
              )}
            </div>
          )}
        </div>

        {/* Cookie Notice */}
        <p className="text-center text-slate-500 text-xs mt-4">
          Твои задачи сохраняются локально в куках
        </p>
      </div>
    </div>
  )
}

export default App
