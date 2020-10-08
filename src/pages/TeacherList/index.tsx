import React, { useState, FormEvent } from 'react';

//custom includes
import { Web } from '@pnp/sp';
import { endpoint } from '../../services/adalConfig';
import convertHourToMinutes from '../../util/convertHourToMinutes';
//end custom includes

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import Input from '../../components/Input';
import Select from '../../components/Select';

import './styles.css';

function TeacherList() {
  const [teachers, setTeachers] = useState<any>([]);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  async function searchTeachers(e: FormEvent) {
    e.preventDefault();

    if(subject === "" || week_day === "" || time === "")
    {
      alert("Todos os filtros são obrigatórios");
      return;
    }
    
    const timeInMinutes = convertHourToMinutes(time);

    let query: string = "ID ne null";
    
    if(subject !== "")
      query += ` and subject eq '${subject}'`;
    
    if(week_day !== "")
      query += ` and week_day eq ${week_day}`;

    if(time !== "")
      query += ` and from le ${timeInMinutes} and to ge ${timeInMinutes}`;

    const web = new Web(`${endpoint}/sites/SharePointAcademy`);
    web.lists
      .getByTitle("ClassSchedule")
      .items.top(5000)
      .select("ID,proffy/ID,proffy/name,proffy/avatar,proffy/whatsapp,subject,class_id,cost,week_day,from,to")      
      .filter(`${query}`)
      .expand("proffy")   
      .orderBy("ID",false)       
      .get()
      .then(items => {
        setTeachers(items);
      },
      (err) => {
        console.log(err);
      });
    

    
  }

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Estes são os proffys disponíveis.">
        <form id="search-teachers" onSubmit={searchTeachers}>
          <Select 
            name="subject" 
            label="Matéria"
            value={subject}
            onChange={(e) => { setSubject(e.target.value) }}
            options={[
              { value: 'Artes', label: 'Artes' },
              { value: 'Biologia', label: 'Biologia' },
              { value: 'Ciências', label: 'Ciências' },
              { value: 'Educação física', label: 'Educação física' },
              { value: 'Física', label: 'Física' },
              { value: 'Geografia', label: 'Geografia' },
              { value: 'História', label: 'História' },
              { value: 'Matemática', label: 'Matemática' },
              { value: 'Português', label: 'Português' },
              { value: 'Química', label: 'Química' },
            ]}
          />
          <Select 
            name="week_day" 
            label="Dia da semana"
            value={week_day}
            onChange={(e) => { setWeekDay(e.target.value) }}
            options={[
              { value: '0', label: 'Domingo' },
              { value: '1', label: 'Segunda-feira' },
              { value: '2', label: 'Terça-feira' },
              { value: '3', label: 'Quarta-feira' },
              { value: '4', label: 'Quinta-feira' },
              { value: '5', label: 'Sexta-feira' },
              { value: '6', label: 'Sábado' },
            ]}
          />
          <Input 
            type="time" 
            name="time" 
            label="Hora"
            value={time}
            onChange={(e) => { setTime(e.target.value) }}
          />
          
          <button type="submit">
            Buscar
          </button>
        </form>
      </PageHeader>

      <main>
        {teachers.map((teacher: Teacher) => {
          return <TeacherItem key={teacher.ID} teacher={teacher} />;
        })}
      </main>
    </div>
  )
}

export default TeacherList;