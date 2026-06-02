document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const darkModeToggle = document.querySelector('#darkmode');
    const body = document.body;
    const roomTableBody = document.getElementById('roomTableBody');
    const studentTableBody = document.getElementById('studentTableBody');
    const seatingPlanTable = document.getElementById('seatingPlanTable').getElementsByTagName('tbody')[0];

    // Data Storage
    let rooms = [];
    let students = [];

    // Dark Mode Logic
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        darkModeToggle.classList.toggle('bx-sun');
        darkModeToggle.classList.toggle('bx-moon');
    });

    // Add Room Logic
    window.addRoom = function() {
        const roomNumber = document.getElementById('roomNumber').value.trim();
        const numberOfSeats = parseInt(document.getElementById('numberOfSeats').value);

        if (roomNumber && !isNaN(numberOfSeats)) {
            rooms.push({ roomNumber, numberOfSeats });
            updateTables();
            document.getElementById('roomNumber').value = '';
            document.getElementById('numberOfSeats').value = '';
        } else {
            alert('Please enter valid room details.');
        }
    };

    // Add Student Group Logic
    window.addStudent = function() {
        const classStream = document.getElementById('studentClassStream').value.trim();
        const total = parseInt(document.getElementById('totalStudents').value);
        const startNo = parseInt(document.getElementById('startingRollNo').value);

        if (classStream && !isNaN(total) && !isNaN(startNo)) {
            students.push({ classStream, total, startNo });
            updateTables();
            document.getElementById('studentClassStream').value = '';
            document.getElementById('totalStudents').value = '';
            document.getElementById('startingRollNo').value = '';
        } else {
            alert('Please fill in valid student details.');
        }
    };

    // Helper to refresh input tables
    function updateTables() {
        roomTableBody.innerHTML = '';
        rooms.forEach((r, i) => {
            let row = roomTableBody.insertRow();
            row.insertCell(0).innerText = i + 1;
            row.insertCell(1).innerText = r.roomNumber;
            row.insertCell(2).innerText = r.numberOfSeats;
        });

        studentTableBody.innerHTML = '';
        students.forEach((s, i) => {
            let row = studentTableBody.insertRow();
            row.insertCell(0).innerText = i + 1;
            row.insertCell(1).innerText = s.classStream;
            row.insertCell(2).innerText = s.total;
            row.insertCell(3).innerText = s.startNo;
        });
    }

    // --- REPLACED: UPDATED GENERATE LOGIC START ---
    window.generateSeatingPlan = function() {
        seatingPlanTable.innerHTML = '';  
        
        if (rooms.length === 0 || students.length === 0) {
            alert("Please add both rooms and students first.");
            return;
        }

        // 1. SORTING LOGIC:
        const sortedRooms = [...rooms].sort((a, b) => b.numberOfSeats - a.numberOfSeats);
        const sortedStudentGroups = [...students].sort((a, b) => b.total - a.total);

        // 2. FLATTEN STUDENTS:
        let allStudents = [];
        sortedStudentGroups.forEach(group => {
            for (let i = 0; i < group.total; i++) {
                allStudents.push({
                    rollNo: group.startNo + i,
                    class: group.classStream
                });
            }
        });

        // 3. SEATING ASSIGNMENT:
        let currentStudentIdx = 0;

        sortedRooms.forEach(room => {
            // Room Header Row
            const roomHeader = seatingPlanTable.insertRow();
            roomHeader.innerHTML = `<td colspan="4" style="background-color: #666; color: white; font-weight: bold; text-align: center;"> 
                Room: ${room.roomNumber} (Capacity: ${room.numberOfSeats}) 
            </td>`;

            for (let seat = 1; seat <= room.numberOfSeats; seat++) {
                if (currentStudentIdx >= allStudents.length) break;

                const student = allStudents[currentStudentIdx];
                const row = seatingPlanTable.insertRow();
                
                row.insertCell(0).innerText = room.roomNumber;
                row.insertCell(1).innerText = `Seat ${seat}`;
                row.insertCell(2).innerText = student.rollNo;
                row.insertCell(3).innerText = student.class;

                currentStudentIdx++;
            }
        });

        // 4. OVERFLOW CHECK:
        if (currentStudentIdx < allStudents.length) {
            const remaining = allStudents.length - currentStudentIdx;
            const warning = seatingPlanTable.insertRow();
            warning.innerHTML = `<td colspan="4" style="background-color: #ff4d4d; color: white; text-align: center; font-weight: bold;">
                WARNING: ${remaining} students could not be seated due to lack of space!
            </td>`;
        }
    };
    // --- UPDATED GENERATE LOGIC END ---
});