const students = [
    {
        name: 'Lyosha',
        age: 9
    },
    {
        name: 'Olga',
        age: 8
    },

]

const showStudents = (arr) => {
  arr.forEach((item, index) =>
    console.log(`Student ${item.name} of age ${item.age} has index ${index}`)
    );
    console.log(' ')
}

showStudents(students);

const shallowStudents = Array.from(students);

students[0].name = 'Igor';
students.push({name: 'Alice', age: 8})

showStudents(students);

const deepCopy = (item) => {
    return JSON.parse(JSON.stringify(item));
}

const deepStudents = deepCopy(students);

students[0].name = "Dima";
students.push({ name: "Alice", age: 8 });
students.push({ name: "Alice", age: 8 });
students.push({ name: "Alice", age: 8 });

showStudents(deepStudents);





