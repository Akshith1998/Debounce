import { useEffect, useState, useRef } from "react";
import "./styles.css";

export const Debounce = (time, callback) => {
  const timerRef = useRef();
  return function (...args) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, time);
  };
};

export default function App() {
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState();

  const fetchTodos = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleFilterTodos = (val) => {
    const filteredItems = todos.filter(
      (item) => val.length && item.title.includes(val)
    );
    setFilteredTodos(filteredItems);
  };

  const debounceSearch = Debounce(3000, handleFilterTodos);

  useEffect(() => {
    debounceSearch(value);

    return () => clearTimeout(debounceSearch.timerRef?.current);
  }, [value]);

  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <input value={value} onChange={handleOnChange} />
      {filteredTodos.length > 0 &&
        filteredTodos.map((item) => {
          return <div key={item.id}>{item.title}</div>;
        })}
    </div>
  );
}
