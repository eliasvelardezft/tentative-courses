const { CourseManager, StudentManager } = require('./models');
const { students, teachers } = require('./generate');

let courseMng = new CourseManager();
courseMng.courses = [teachers, students];
let courses = courseMng.courses;

let studentMng = new StudentManager(students);
studentMng.objByLevel(students);

test('creates one course per each teacher disponibility item', () => {
  let sum = 0;
  teachers.forEach(teacher => {
    sum += teacher.avaliability.length;
  })
  expect(courses.length).toEqual(sum);
})

test('groups students by level', () => {
  let obj = studentMng.groupedByLevel;
  let sum = 0;
  for(let key in obj) {
    sum += obj[key].length;
  }
  expect(sum).toBe(students.length);
})

test('for each level, add each student to the first course that matches any of their avaliabilities', () => {
  courses.forEach(course => {
    if(course.students.length !== 0) {
      course.students.forEach(student => {
        expect(student.level).toEqual(course.level);
      })
    }
  })
})

test('courses can have no more than 6 students', () => {
  let correct = true;
  courses.forEach(course => {
    if(course.students.length > 6) {
      correct = false;
    }
  });
  expect(correct).toBeTruthy();
})

test("if a course has a student with mode 0(individual), then it can't accept more", () => {
  courses.forEach(course => {
    let isIndividual = false;
    course.students.forEach(student => {
      if(student.mode === 'Individual') {
        isIndividual = true;
      }
    })
    if(isIndividual) {
      expect(course.students.length).toEqual(1);
    }
  })
});

test("a student is not in two courses", () => {
  students.forEach(student => {
    let exists = 0;
    courses.forEach(course => {
      if(course.students.includes(student)){
        exists += 1;
      }
    })
    expect(exists).toBeLessThanOrEqual(1);
  })
})

test("the students that couldn't be added to a course are stored in a pending list", () => {
  let pendingTest = [];
  students.forEach(student => {
    let assigned = false;
    for(let i = 0; i < courses.length; i++) {
      let course = courses[i];
      if(course.students.includes(student)){
        assigned = true;
        break;
      }
    };
    if(!assigned){
      pendingTest.push(student);
    }
  });
  expect(new Set(courseMng.pendingStudents)).toEqual(new Set(pendingTest));
  expect(courseMng.pendingStudents.length).toEqual(pendingTest.length);
})





