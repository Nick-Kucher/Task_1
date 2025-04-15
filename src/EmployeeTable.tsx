import React, { useEffect, useState } from 'react';

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  position: string;
};

const STORAGE_KEY = 'employees';

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<{ [key: number]: Employee }>({});
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0, firstName: '', lastName: '', age: 0, position: '',
  });


  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData && typeof parsedData === 'object') {
        setEmployees(parsedData);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(employees).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const addEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.position) return;

    const nextId = Math.max(0, ...Object.keys(employees).map((key) => Number(key))) + 1;
    const newEmployeeWithId = { ...newEmployee, id: nextId, age: Number(newEmployee.age) };

    setEmployees({
      ...employees,
      [nextId]: newEmployeeWithId,
    });

    setNewEmployee({ id: 0, firstName: '', lastName: '', age: 0, position: '' });
  };

  const deleteEmployee = (id: number) => {
    const updatedEmployees = { ...employees };
    delete updatedEmployees[id];
    setEmployees(updatedEmployees);
  };

  const updateEmployee = (id: number, key: keyof Employee, value: string) => {
    setEmployees({
      ...employees,
      [id]: { ...employees[id], [key]: key === 'age' ? Number(value) : value },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Працівники</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Прізвище</th>
            <th>Ім'я</th>
            <th>Вік</th>
            <th>Посада</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(employees).length > 0 ? (
            Object.keys(employees).map((key) => {
              const emp = employees[Number(key)];
              return (
                <tr key={emp.id}>
                  <td>
                    <input
                      value={emp.lastName}
                      onChange={e => updateEmployee(emp.id, 'lastName', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={emp.firstName}
                      onChange={e => updateEmployee(emp.id, 'firstName', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={emp.age}
                      onChange={e => updateEmployee(emp.id, 'age', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={emp.position}
                      onChange={e => updateEmployee(emp.id, 'position', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteEmployee(emp.id)}>🗑️ Видалити</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>Працівників немає.</td>
            </tr>
          )}
          <tr>
            <td><input name="lastName" value={newEmployee.lastName} onChange={handleInputChange} /></td>
            <td><input name="firstName" value={newEmployee.firstName} onChange={handleInputChange} /></td>
            <td><input name="age" type="number" value={newEmployee.age || ''} onChange={handleInputChange} /></td>
            <td><input name="position" value={newEmployee.position} onChange={handleInputChange} /></td>
            <td><button onClick={addEmployee}>➕ Додати</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
