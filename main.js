const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());


const coursesRoute = require("./routes/courses.route");
app.use("/api/courses", coursesRoute);

const usersRoute = require("./routes/users.route");
app.use("/api/users", usersRoute);

const userCourses = require("./routes/userCourses");
app.use("/api/book", userCourses);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
