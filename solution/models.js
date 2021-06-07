const uniqid = require('uniqid');

class Student {
  constructor(mode, level, avaliability) {
    this.id = uniqid();
    this.mode = mode;
    this.level = level;
    this.avaliability = avaliability;
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    const modes = ['Group', 'Individual'];
    this._mode = modes[value];
  }

  get level() {
    return this._level;
  }
  set level(value) {
    const levels = [
      'Beginner',
      'Pre-Intermediate',
      'Intermediate',
      'Upper-Intermediate',
      'Advanced'
    ]
    this._level = levels[value];
  }

  get avaliability() {
    return this._avaliability;
  }
  set avaliability(pairs) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = [...Array(11).keys()].map(n => n + 9);
    let av = pairs.map(pair => {
      if(days.includes(pair[0]) && hours.includes(pair[1])) {
        return pair;
      }
    });
    this._avaliability = av;
  }
}

class Teacher {
  constructor(avaliability) {
    this.avaliability = avaliability;
  }
  get avaliability() {
    return this._avaliability;
  }
  set avaliability(pairs) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = [...Array(11).keys()].map(n => n + 9);
    const av = pairs.map(pair => {
      if(days.includes(pair[0]) && hours.includes(pair[1])) {
        return pair;
      }
    });
    this._avaliability = av;
  }
}

class Course {
  constructor(teacher=undefined, mode=undefined, level=undefined, datetime=undefined, students=undefined) {
    this.id = uniqid();
    this.teacher = teacher;
    this.mode = mode;
    this.level = level;
    this.datetime = datetime;
    this.students = students;
  }
}

class CourseManager { 
  constructor() {
    this._courses = [];
    this._pendingStudents = [];
  }
  get courses() {
    return this._courses;
  }
  set courses(args) {
    let teacherMng = new TeacherManager(args[0]);
    let studentMng = new StudentManager(args[1]);
    // Here a course is created for each avaliability item of each teacher
    teacherMng.teachers.forEach(teacher => {
      teacher.avaliability.forEach(time => {
        let course = new Course(teacher, undefined, undefined, time, [])
        this._courses.push(course);
      })
    });
    studentMng.objByLevel();
    let objByLevel = studentMng.groupedByLevel;
    for(let level in objByLevel) {
      objByLevel[level].forEach(student => {
        let wasAssigned = false;
        for(let j = 0; j < this._courses.length; j++) {
          let course = this._courses[j];
          if(
            // These are all the conditions that have to be true
            // for a student to be added to a course
               (JSON.stringify(student.avaliability).includes(JSON.stringify(course.datetime)))
            && (course.level == undefined || course.level == student.level)
            && (course.students.length < 6)
            && ((course.mode == 'Group' || course.mode == undefined) && (course.mode == student.mode || course.mode == undefined))
            && (!course.students.includes(student))
          ){
            course.students.push(student);

            if(course.level === undefined) {
              course.level = student.level;
            }
            if(course.mode === undefined) {
              course.mode = student.mode;
            }

            wasAssigned = true;
            break;
          }
        }
        if(wasAssigned == false) {
          this._pendingStudents.push(student);
        }
      })
    }
  }
  get pendingStudents() {
    return this._pendingStudents;
  }
}

class StudentManager {
  constructor(students) {
    this._groupedByLevel = {
      'Beginner': [],
      'Pre-Intermediate': [],
      'Intermediate': [],
      'Upper-Intermediate': [],
      'Advanced': [],
    };
    this._students = students;
  }
  get students() {
    return this._students;
  }
  set students(st) {
    this._students = st;
  }

  get groupedByLevel() {
    return this._groupedByLevel;
  }
  // This is the method that groups the students by their levels
  objByLevel() {
    this._students.forEach(student => {
      this._groupedByLevel[student.level].push(student);
    })
  }
}

class TeacherManager {
  constructor(teachers) {
    this._teachers = teachers;
  }
  get teachers() {
    return this._teachers;
  }
  set teachers(te) {
    this._teachers = te;
  }
}

module.exports = {
  Student, 
  Teacher, 
  CourseManager,
  StudentManager,
}





