export const initialStore = () => {
  return {
    message: null,

    user: null,

    token: sessionStorage.getItem("token") || null,

    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {

  switch (action.type) {

    case 'set_hello':

      return {
        ...store,
        message: action.payload
      };

    case 'add_task':

      const { id, color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id
            ? { ...todo, background: color }
            : todo
        )
      };

    // =========================
    // SIGNUP
    // =========================

    case 'signup':

      return {
        ...store
      };

    // =========================
    // LOGIN
    // =========================

    case 'login':

      sessionStorage.setItem("token", action.payload.token)

      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user
      };

    // =========================
    // LOGOUT
    // =========================

    case 'logout':

      sessionStorage.removeItem("token")

      return {
        ...store,
        token: null,
        user: null
      };

    default:
      throw Error('Unknown action.');
  }
}