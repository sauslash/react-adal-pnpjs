import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

//custom includes
import { Web } from '@pnp/sp';
import axios from 'axios';
import { endpoint } from '../../services/adalConfig';
import convertHourToMinutes from '../../util/convertHourToMinutes';
//end custom includes

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Select from '../../components/Select';
import warningIcon from '../../assets/images/icons/warning.svg';
import './styles.css';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

function TeacherForm() {
  const history = useHistory();

  const [name, setName] = useState('');
  const [github, setGitHub] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [subject, setSubject] = useState('');
  const [cost, setCost] = useState('');

  const [scheduleItems, setScheduleItems] = useState([
    { week_day: 0, from: '', to: '' }
  ]);

  function addNewScheduleItem() {
    setScheduleItems([
      ...scheduleItems,
      { week_day: 0, from: '', to: '' }
    ]);
  }

  function setScheduleItemValue(position: number, field: string, value: string) {
    const updatedScheduleItems = scheduleItems.map((scheduleItem, index) => {
      if (index === position) {
        return { ...scheduleItem, [field]: value };
      }

      return scheduleItem;
    });

    setScheduleItems(updatedScheduleItems);
  }

  async function handleCreateClass(e: FormEvent) {
    e.preventDefault();

    try
    {
      const web = new Web(`${endpoint}/sites/SharePointAcademy`);
      let idProffy: number;
      let idClasse: number;

      const apiResponse = await axios.get(`https://api.github.com/users/${github}`);
      const { id, bio } = apiResponse.data;
      let avatar_url = `https://avatars3.githubusercontent.com/u/${id}?s=460`;

      idProffy = await insertProffy(web, avatar_url, bio);
      idClasse = await insertClasses(web,idProffy);
      await insertClasseSchedule(web, idClasse, idProffy);

      alert('Cadastro realizado com sucesso!');
      history.push('/');
    }
    catch(err)
    {
      console.log("Error", err);
    }

  }

  async function insertProffy(web: Web, avatar: string, bio: string) {
    let idProffy: number = 0;
    await web.lists.getByTitle("Proffy").items.add({
      name: name,
      avatar: avatar,
      whatsapp: whatsapp,
      bio: bio
    }).then(response => {
      idProffy = response.data.ID;
    });

    return idProffy;
  }

  async function insertClasses(web: Web, idProffy: number){
    let idClasse: number = 0;
    await web.lists.getByTitle("Classes").items.add({
      subject: subject,
      cost: cost,
      user_id : idProffy,
    }).then(response => {              
      idClasse = response.data.ID;
    });

    return idClasse;
  }

  async function insertClasseSchedule(web: Web, idClasse: number, idProffy: number) {
    let scheduleItem: ScheduleItem;
    for(let i = 0; i < scheduleItems.length; i++)
    {
      scheduleItem = scheduleItems[i];
      await web.lists.getByTitle("ClassSchedule").items.add({
        class_id: idClasse,
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
        subject: subject,
        cost: cost,
        proffyId: idProffy,
      }).then(response => {        
      });
    }
  }

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader 
        title="Que incrível que você quer dar aulas."
        description="O primeiro passo é preencher esse formulário de inscrição"
      />

      <main>
        <form onSubmit={handleCreateClass}>
          <fieldset>
            <legend>Seus dados</legend>

            <Input 
              name="name" 
              label="Nome completo" 
              value={name}
              onChange={(e) => { setName(e.target.value) }}
            />

            <Input 
              name="gitHubUserName" 
              label="GitHub"
              value={github}
              onChange={(e) => { setGitHub(e.target.value) }}
            />

            <Input 
              name="whatsapp" 
              label="WhatsApp"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value) }}
            />

          </fieldset>

          <fieldset>
            <legend>Sobre a aula</legend>

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
            
            <Input 
              name="cost" 
              label="Custo da sua hora por aula"
              value={cost}
              onChange={(e) => { setCost(e.target.value) }}
            />
          </fieldset>

          <fieldset>
            <legend>
              Horários disponíveis
              <button type="button" onClick={addNewScheduleItem}>
                + Novo horário
              </button>
            </legend>
            
            {scheduleItems.map((scheduleItem, index) => {
              return (
                <div key={index} className="schedule-item">
                  <Select 
                    name="week_day" 
                    label="Dia da semana"
                    value={scheduleItem.week_day}
                    onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
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
                    name="from" 
                    label="Das" 
                    type="time"
                    value={scheduleItem.from}
                    onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                  />

                  <Input 
                    name="to" 
                    label="Até" 
                    type="time"
                    value={scheduleItem.to}
                    onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                  />

                </div>
              );
            })}
          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante" />
              Importante! <br />
              Preencha todos os dados
            </p>
            <button type="submit">
              Salvar cadastro
            </button>
          </footer>
        </form>
      </main>
    </div>
  )

  
}

export default TeacherForm;