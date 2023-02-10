const LocalStorage = {
    saveUser(input) {
      let user = JSON.stringify(input);
      if (typeof user !== "string") return "invalid input";
      localStorage.setItem("user", user);
  
      return localStorage.getItem("user");
    },
  
    getUser() {
      return localStorage.getItem("user");
    },
  };

export { LocalStorage };