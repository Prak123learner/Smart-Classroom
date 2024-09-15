// Class for Course
class Course {
    constructor(courseName, professorName, sectionName, credits, batchName, isLab) {
        this.courseName = courseName;
        this.professorName = professorName;
        this.sectionName = sectionName;
        this.credits = credits;
        this.batchName = batchName;
        this.isLab = isLab; // true for lab courses, false for regular courses
    }
}

// Class for Professor
class Professor {
    constructor(professorName) {
        this.professorName = professorName;
    }
}

// Class for Section
class Section {
    constructor(sectionName) {
        this.sectionName = sectionName;
    }
}

// Class for Batch
class Batch {
    constructor(batchName) {
        this.batchName = batchName;
    }
}

// Class for TimeTableRow (represents one entry in the timetable)
class TimeTableRow {
    constructor(courseName, professorName, sectionName, batchName, isLab, timeSlot) {
        this.courseName = courseName;
        this.professorName = professorName;
        this.sectionName = sectionName;
        this.batchName = batchName;
        this.isLab = isLab;
        this.timeSlot = timeSlot;
    }
}

// Helper function to get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to generate random chromosomes (timetables)
function createChromosomes(numChromosomes, courses, professors, sections, batches, timeSlots) {
    let chromosomes = [];

    // Loop to create each chromosome
    for (let i = 0; i < numChromosomes; i++) {
        let chromosome = []; // Each chromosome is a potential timetable

        // For each course, generate a gene (time slot, professor, section, batch)
        courses.forEach(course => {
            let professor = getRandomElement(professors);
            let section = getRandomElement(sections);
            let batch = getRandomElement(batches);
            let timeSlot = getRandomElement(timeSlots);
            
            // Create a timetable entry (gene) for this course
            let gene = new TimeTableRow(course.courseName, professor.professorName, section.sectionName, batch.batchName, course.isLab, timeSlot);
            chromosome.push(gene);
        });

        // Add the generated chromosome to the population
        chromosomes.push(chromosome);
    }

    return chromosomes;
}

// Helper function to print the timetable in a structured way
function printTimeTable(chromosome) {
    console.log("------------------------------------------------------");
    console.log("Time Slot      | Course        | Professor    | Section | Batch   | Lab");
    console.log("------------------------------------------------------");
    chromosome.forEach(gene => {
        console.log(`${gene.timeSlot.padEnd(14)} | ${gene.courseName.padEnd(12)} | ${gene.professorName.padEnd(12)} | ${gene.sectionName.padEnd(7)} | ${gene.batchName.padEnd(7)} | ${gene.isLab ? 'Yes' : 'No'}`);
    });
    console.log("------------------------------------------------------\n");
}

// Example data to pass into the function
let courses = [
    new Course("Mathematics", "", "", 3, "", false),
    new Course("Physics Lab", "", "", 2, "", true),
    new Course("Chemistry", "", "", 3, "", false),
    new Course("Computer Science", "", "", 4, "", false),
    new Course("Biology Lab", "", "", 2, "", true),
];

let professors = [
    new Professor("Prof. John"),
    new Professor("Prof. Alice"),
    new Professor("Prof. Bob"),
    new Professor("Prof. Charlie"),
    new Professor("Prof. Eve"),
];

let sections = [
    new Section("A"),
    new Section("B"),
];

let batches = [
    new Batch("Batch 1"),
    new Batch("Batch 2"),
    new Batch("Batch 3"),
];

let timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
];

// Generate 5 chromosomes (random timetables)
let chromosomes = createChromosomes(5, courses, professors, sections, batches, timeSlots);

// Print each chromosome
chromosomes.forEach((chromosome, index) => {
    console.log(`Chromosome ${index + 1}:`);
    printTimeTable(chromosome);
});
