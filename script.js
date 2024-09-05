document.getElementById('formGroups').addEventListener('click', function () {
    const input = document.getElementById('studentsInput').value;
    const students = [];
    const lines = input.split(/\n|,/).map(line => line.trim());

    lines.forEach(line => {
        const parts = line.split(' ');
        const name = parts.slice(0, -1).join(' ');
        const grade = parts.length > 1 ? parseFloat(parts.pop()) : 0;
        students.push({ name, grade: isNaN(grade) ? 0 : grade });
    });

    const numberOfGroups = parseInt(document.getElementById('numberOfGroups').value);
    const numberOfCoordinators = parseInt(document.getElementById('numberOfCoordinators').value);

    if (students.length < numberOfGroups * (1 + numberOfCoordinators)) {
        alert('No hay suficientes estudiantes para asignar presidentes y coordinadores a todos los grupos.');
        return;
    }

    // Ordenar estudiantes por nota de mayor a menor
    students.sort((a, b) => b.grade - a.grade);

    const groups = Array.from({ length: numberOfGroups }, () => ({
        president: null,
        coordinators: [],
    }));

    // Asignar presidentes
    for (let i = 0; i < numberOfGroups; i++) {
        if (i < students.length) {
            groups[i].president = students[i];
        }
    }

    // Obtener los estudiantes restantes para los coordinadores
    let remainingStudents = students.slice(numberOfGroups); // Excluir a los presidentes

    // Ordenar los coordinadores de mayor a menor
    remainingStudents.sort((a, b) => b.grade - a.grade);

    // Seleccionar coordinadores
    const coordinators = remainingStudents.slice(0, numberOfGroups * numberOfCoordinators);

    // Asignar coordinadores
    for (let i = 0; i < numberOfGroups; i++) {
        const lowestCoordinator = coordinators.pop(); // Tomar el coordinador con la nota más baja
        const highestCoordinator = coordinators.pop(); // Tomar el coordinador con la nota más alta
        
        // Asignar coordinadores a presidentes
        if (lowestCoordinator) {
            groups[i].coordinators.push(lowestCoordinator);
        }
        if (highestCoordinator) {
            groups[i].coordinators.push(highestCoordinator);
        }
    }

    // Mostrar resultados
    const groupsContainer = document.getElementById('groupsContainer');
    groupsContainer.innerHTML = '';
    groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.innerHTML = `<h3>Grupo ${index + 1}</h3>
            <p><strong>Presidente:</strong> ${group.president.name} (${group.president.grade})</p>
            <p><strong>Coordinadores:</strong> ${group.coordinators.map(co => co.name + ' (' + co.grade + ')').join(', ') || 'Ninguno'}</p>`;
        groupsContainer.appendChild(groupDiv);
    });
});