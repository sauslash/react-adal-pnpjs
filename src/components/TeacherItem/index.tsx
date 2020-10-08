import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';
import api from '../../services/api';

import './styles.css';

export interface Teacher {
  ID: number;
  proffy: {
    id: number;
    name: string;
    avatar: string;
    bio: string;
    whatsapp: string;
  };
  cost: number;  
  subject: string;
  
}

interface TeacherItemProps {
  teacher: Teacher;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher }) => {
  function createNewConnection() {
    api.post('connections', {
      user_id: teacher.proffy.id,
    })
  }

  return (
    <article className="teacher-item">
      <header>
        <img src={teacher.proffy.avatar} alt={teacher.proffy.name} />
        <div>
          <strong>{teacher.proffy.name}</strong>
          <span>{teacher.subject}</span>
        </div>
      </header>

      <p>{teacher.proffy.bio}</p>

      <footer>
        <p>
          Preço/hora
          <strong>R$ {teacher.cost}</strong>
        </p>
        <a 
          target="_blank" 
          onClick={createNewConnection} 
          href={`https://wa.me/${teacher.proffy.whatsapp}`}
        >
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato
        </a>
      </footer>
    </article>
  );
}

export default TeacherItem;
