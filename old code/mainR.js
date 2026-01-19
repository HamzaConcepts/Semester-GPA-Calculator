let semesterCount = 0;
let totalCredits = 0;
let totalWeightedGPA = 0;

function addBSCSContent() {
    const bscsData = [
        {
            semester: 1,
            subjects: [
                { name: 'PF Theory', credits: 3 },
                { name: 'PF Lab', credits: 1 },
                { name: 'ICT Theory', credits: 2 },
                { name: 'ICT Lab', credits: 1 },
                { name: 'Pak Studies', credits: 2 },
                { name: 'Calculus', credits: 3 },
                { name: 'English General', credits: 3 } ,
                { name: 'Physics', credits: 3 }
            ]
        },
        {
            semester: 2,
            subjects: [
                { name: 'English Functional', credits: 3 },
                { name: 'Linear Algebra', credits: 3 },
                { name: 'Discrete Structures', credits: 3 },
                { name: 'ITB', credits: 3 },
                { name: 'OOP Theory', credits: 3 },
                { name: 'OOP Lab', credits: 1 },
                { name: 'Islamic Studies', credits: 2 }
            ]
        },
        {
            semester: 3,
            subjects: [
                { name: 'DSA Theory', credits: 3 },
                { name: 'DSA Lab', credits: 1 },
                { name: 'DLD Theory', credits: 3 },
                { name: 'DLD Lab', credits: 1 },
                { name: 'English Academic', credits: 3 },
                { name: 'Multi-Variate Calculus', credits: 3 },
                { name: 'Probability and Statistics', credits: 3 }
            ]
        }
    ];
    
    function addKnownSubjects(semesterId, name = '', credits = '') {
        const subjectsDiv = document.getElementById(`subjects-${semesterId}`);
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject';
        subjectDiv.innerHTML = `
            <div class="subject-style">
                <label class="subject-name">${name}</label>
            </div>
            <div class="marks-style">
                <input type="number" placeholder="Marks" class="marks">
                <select class="gpaOrMarks">
                    <option value="gpa">GPA</option>
                    <option value="marks">Marks</option>
                </select>
            </div>
            <label class="credits">Credit Hours: ${credits}</label>
        `;
        subjectsDiv.appendChild(subjectDiv);
    }


    bscsData.forEach(data => {
        addSemester();
        data.subjects.forEach(subject => {
            addKnownSubjects(data.semester, subject.name, subject.credits);
        });
    });
}

function addSemester() {
    semesterCount = document.querySelectorAll('.semester').length + 1;
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';
    semesterDiv.id = `semester-${semesterCount}`;
    semesterDiv.innerHTML = `
        <h3>Semester ${semesterCount}</h3>
        <div id="subjects-${semesterCount}"></div>
        <div class="buttons">
            <button onclick="addSubject(${semesterCount})" class="add-btn">Add Subject</button>
            <button onclick="deleteSubject(${semesterCount})" class="del-btn">Delete Last Subject</button>
        </div>
        <h4 id="sGPA-${semesterCount}">Semester GPA (sGPA): 0.00</h4>
    `;
    document.getElementById('semesters').appendChild(semesterDiv);
}

function addSubject(semesterId, name = '', credits = '') {
    const subjectsDiv = document.getElementById(`subjects-${semesterId}`);
    const subjectDiv = document.createElement('div');
    subjectDiv.className = 'subject';
    subjectDiv.innerHTML = `
        <input type="text" placeholder="Subject Name" class="subject-name" value="${name}">
        <input type="number" placeholder="Marks" class="marks">
        <select class="gpaOrMarks">
            <option value="gpa">GPA</option>
            <option value="marks">Marks</option>
        </select>
        <input type="number" placeholder="Credit Hours" class="credits" value="${credits}">
    `;
    subjectsDiv.appendChild(subjectDiv);
}

function deleteSubject(semesterId) {
    const subjectsDiv = document.getElementById(`subjects-${semesterId}`);
    if (subjectsDiv.lastChild) {
        subjectsDiv.lastChild.remove();
        calculateSGPA(semesterId);
    }
}

function calculateSGPA(semesterId) {
    const subjectsDiv = document.getElementById(`subjects-${semesterId}`);
    const subjects = subjectsDiv.querySelectorAll('.subject');
    let semesterCredits = 0;
    let semesterWeightedGPA = 0;

    subjects.forEach(subject => {
        const marksInput = subject.querySelector('.marks');
        const creditsElement = subject.querySelector('.credits');
        const gpaOrMarksSelect = subject.querySelector('.gpaOrMarks');

        // Extract marks and determine GPA
        const marks = parseFloat(marksInput.value) || 0;
        const isGPA = gpaOrMarksSelect.value === 'gpa';
        const gpa = isGPA ? marks : marksToGPA(marks);

        // Extract credits (handle both input and label)
        let credits = 0;
        if (creditsElement.tagName === 'INPUT') {
            credits = parseFloat(creditsElement.value) || 0;
        } else {
            const creditText = creditsElement.textContent;
            credits = parseFloat(creditText.match(/\d+/)[0]) || 0;
        }

        semesterCredits += credits;
        semesterWeightedGPA += gpa * credits;
    });

    const semesterGPA = semesterCredits > 0 ? (semesterWeightedGPA / semesterCredits) : 0;
    document.getElementById(`sGPA-${semesterId}`).textContent = `Semester GPA (sGPA): ${semesterGPA.toFixed(2)}`;
    updateCGPA();
}

function updateCGPA() {
    totalCredits = 0;
    totalWeightedGPA = 0;

    document.querySelectorAll('.semester').forEach(semester => {
        const subjects = semester.querySelectorAll('.subject');
        subjects.forEach(subject => {
            const marksInput = subject.querySelector('.marks');
            const creditsElement = subject.querySelector('.credits');
            const gpaOrMarksSelect = subject.querySelector('.gpaOrMarks');

            // Extract marks and determine GPA
            const marks = parseFloat(marksInput.value) || 0;
            const isGPA = gpaOrMarksSelect.value === 'gpa';
            const gpa = isGPA ? marks : marksToGPA(marks);

            // Extract credits
            let credits = 0;
            if (creditsElement.tagName === 'INPUT') {
                credits = parseFloat(creditsElement.value) || 0;
            } else {
                const creditText = creditsElement.textContent;
                credits = parseFloat(creditText.match(/\d+/)[0]) || 0;
            }

            totalCredits += credits;
            totalWeightedGPA += gpa * credits;
        });
    });

    const cumulativeGPA = totalCredits > 0 ? (totalWeightedGPA / totalCredits) : 0;
    document.getElementById('cGPA').textContent = `Cumulative GPA (cGPA): ${cumulativeGPA.toFixed(2)}`;
}

function marksToGPA(marks) {
    if (marks >= 87) return 4.0;
    if (marks >= 80) return 3.5;
    if (marks >= 72) return 3.0;
    if (marks >= 66) return 2.5;
    if (marks >= 60) return 2.0;
    return 0.0;
}

document.body.addEventListener('input', () => {
    const semesters = document.querySelectorAll('.semester');
    semesters.forEach(semester => {
        calculateSGPA(semester.id.split('-')[1]);
    });
});

addBSCSContent();