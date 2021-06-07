const { Teacher, Student } = require('./models');


function generateAvaliability(max) {
  let n = Math.floor((Math.random() * max) + 1)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [...Array(11).keys()].map(n => n + 9);
  let avaliabilities = [];
  for(let i = 0; i < n; i++) {
    let single = [];
    single.push(days[Math.floor(Math.random() * days.length)]);
    single.push(hours[Math.floor(Math.random() * hours.length)]);
    avaliabilities.push(single);
  }
  return avaliabilities;
}


function generateStudents(n) {
  let students = [];

  for(let i = 0; i < n; i++) {
    let student = new Student(undefined, undefined, []);
    student.mode = Math.floor(Math.random() * 2);
    student.level = Math.floor(Math.random() * 5);
    student.avaliability = generateAvaliability(5);
    students.push(student); 
  }

  return students;
}

function generateTeachers(n) {
  let teachers = [];

  for(let i = 0; i < n; i++) {
    let avaliability = generateAvaliability(5);
    let teacher = new Teacher(avaliability);
    teachers.push(teacher);
  };

  return teachers;
}

let students = generateStudents(6000);
let teachers = generateTeachers(1000);


module.exports = {
  teachers, 
  students
}