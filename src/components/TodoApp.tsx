import { useState, useEffect } from 'react';
import { Sun, Moon, Check, Trash, Plus, Filter } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import favicon from '@/assets/icons/favicon-1755431273048.ico';
import OG from '@/assets/images/og-1755431740768.webp';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

const TodoApp = () => {
  const { theme, setTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      createdAt: new Date()
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="todo-container neumorphic w-full max-w-md relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0 overflow-hidden">
          <img src={favicon} alt="background icon" className="w-64 h-64 opacity-80" />
        </div>
        <header className="todo-header relative z-10 flex items-center gap-2">
          <img src={favicon} alt="What A App" className="h-6 w-6" />
          <img src={OG} alt="OG Image" className="h-8 w-8 rounded-md object-cover" />
          <h1 className="text-2xl font-bold text-foreground">What A App</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="theme-toggle ml-auto" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>r>
        
        <div className="todo-input-container relative z-10">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="todo-input"
          />
          <Button 
            onClick={addTodo} 
            className="todo-add-button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveFilter} className="relative z-10">
          <TabsList className="todo-filters grid grid-cols-3 mb-4">
            <TabsTrigger value="all" className={activeFilter === 'all' ? 'todo-filter-button-active' : ''}>All</TabsTrigger>
            <TabsTrigger value="active" className={activeFilter === 'active' ? 'todo-filter-button-active' : ''}>Active</TabsTrigger>
            <TabsTrigger value="completed" className={activeFilter === 'completed' ? 'todo-filter-button-active' : ''}>Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {filteredTodos.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No tasks yet. Add one above!</div>
            )}
            {filteredTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={`todo-item group ${todo.completed ? 'is-completed' : ''}`}
              >
                <Checkbox 
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className={`todo-checkbox ${todo.completed ? 'animate-task-complete' : ''}`}
                />
                <label 
                  htmlFor={`todo-${todo.id}`} 
                  className={`todo-text flex-1 cursor-pointer ${todo.completed ? 'todo-text-completed' : ''}`}
                >
                  {todo.text}
                </label>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTodo(todo.id)} 
                  className="todo-delete-button opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            {filteredTodos.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No active tasks!</div>
            )}
            {filteredTodos.map((todo) => (
              <div key={todo.id} className="todo-item group">
                <Checkbox 
                  id={`todo-${todo.id}-active`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <label 
                  htmlFor={`todo-${todo.id}-active`} 
                  className="todo-text flex-1 cursor-pointer"
                >
                  {todo.text}
                </label>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTodo(todo.id)} 
                  className="todo-delete-button opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {filteredTodos.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No completed tasks!</div>
            )}
            {filteredTodos.map((todo) => (
              <div key={todo.id} className="todo-item group is-completed">
                <Checkbox 
                  id={`todo-${todo.id}-completed`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <label 
                  htmlFor={`todo-${todo.id}-completed`} 
                  className="todo-text todo-text-completed flex-1 cursor-pointer"
                >
                  {todo.text}
                </label>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTodo(todo.id)} 
                  className="todo-delete-button opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="todo-stats relative z-10">
          <Badge variant="outline" className="bg-surface-muted">
            {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
