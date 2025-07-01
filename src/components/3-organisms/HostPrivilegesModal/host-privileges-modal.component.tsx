// // src/components/3-organisms/HostPrivilegesModal/host-privileges-modal.component.tsx
// import React, { useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
// import { setCardValues, assignHost } from '../../../store/slices/gameSlice';
// import Button from '../../1-atoms/Button/button.component';
// import './host-privileges-modal.component.scss';

// interface HostPrivilegesModalProps {
//   onClose: () => void;
// }

// // --- CHANGE 1: Define the new data pools ---
// // A pool of potential numbers for the deck.
// const numberPool = [0, 1, 2, 3, 5, 8, 13, 20, 21, 34, 40, 55, 89, 100];

// // A pool of relevant emojis for the deck.
// const emojiPool = ['☕️', '❓', '♾️', '🍕', '💡', '🤔', '💻', '🤯', '🔥'];

// // A standard helper function to shuffle an array randomly.
// const shuffleArray = <T,>(array: T[]): T[] => {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// };

// const HostPrivilegesModal: React.FC<HostPrivilegesModalProps> = ({
//   onClose,
// }) => {
//   const dispatch = useAppDispatch();
//   const {
//     players,
//     cardValues: globalCardValues,
//     hostId,
//     currentUser,
//   } = useAppSelector((state) => state.game);

//   const [localCardValues, setLocalCardValues] = useState(globalCardValues);
//   const [selectedNewHost, setSelectedNewHost] = useState(hostId);

//   const handleCardValueChange = (index: number, value: string) => {
//     const newValues = [...localCardValues];
//     newValues[index] = value;
//     setLocalCardValues(newValues);
//   };

//   // --- CHANGE 2: Implement the new randomization logic ---
//   const handleRandomize = () => {
//     // 1. Shuffle both pools to get random items.
//     const shuffledEmojis = shuffleArray(emojiPool);
//     const shuffledNumbers = shuffleArray(numberPool);

//     // 2. Take 2 unique emojis and 10 unique numbers.
//     const selectedEmojis = shuffledEmojis.slice(0, 2);
//     const selectedNumbers = shuffledNumbers.slice(0, 10).map(String); // .map(String) to ensure they are strings

//     // 3. Combine them into a new 12-card deck.
//     const newDeck = [...selectedNumbers, ...selectedEmojis];

//     // 4. Shuffle the final deck so the emojis are mixed in randomly.
//     const finalShuffledDeck = shuffleArray(newDeck);

//     // 5. Update the local state to show the new deck in the inputs.
//     setLocalCardValues(finalShuffledDeck);
//   };

//   const handleSaveChanges = () => {
//     dispatch(setCardValues(localCardValues));
//     if (selectedNewHost !== hostId) {
//       dispatch(assignHost(selectedNewHost!));
//     }
//     onClose();
//   };

//   const isCurrentUserTheHost = currentUser?.id === hostId;

//   // The JSX for the component remains exactly the same.
//   // No changes are needed in the return statement.
//   return (
//     <div className="host-modal-overlay">
//       <div className="host-modal-content">
//         <div className="host-modal-header">
//           <h3>Opciones de la Sala</h3>
//           <button className="close-button" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <div className="host-modal-body">
//           <div className="modal-section">
//             <h4>Valores de las Cartas</h4>
//             <div className="card-editor-grid">
//               {localCardValues.map((value, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   value={value}
//                   onChange={(e) => handleCardValueChange(index, e.target.value)}
//                   className="card-value-input"
//                 />
//               ))}
//             </div>
//             <Button variant="outline" onClick={handleRandomize}>
//               Usar Cartas Aleatorias
//             </Button>
//           </div>

//           {isCurrentUserTheHost && (
//             <div className="modal-section">
//               <h4>Promover a Anfitrión</h4>
//               <p className="modal-section__description">
//                 El nuevo anfitrión tendrá control total sobre la sala.
//               </p>
//               <select
//                 className="player-select"
//                 value={selectedNewHost || ''}
//                 onChange={(e) => setSelectedNewHost(e.target.value)}
//               >
//                 {players.map((player) => (
//                   <option key={player.id} value={player.id}>
//                     {player.name}{' '}
//                     {player.id === hostId ? '(Anfitrión Actual)' : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <Button onClick={handleSaveChanges} className="save-button">
//             Guardar Cambios
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HostPrivilegesModal;






// // src/components/3-organisms/HostPrivilegesModal/host-privileges-modal.component.tsx
// // src/components/3-organisms/HostPrivilegesModal/host-privileges-modal.component.tsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
// --- Añadir la importación de la nueva acción ---
import {
  setCardValues,
  assignHost,
  togglePlayerRole,
} from '../../../store/slices/gameSlice';
import Button from '../../1-atoms/Button/button.component';
import './host-privileges-modal.component.scss';

interface HostPrivilegesModalProps {
  onClose: () => void;
}

// ... (las constantes y la función shuffleArray no cambian)
const numberPool = [0, 1, 2, 3, 5, 8, 13, 20, 21, 34, 40, 55, 89, 100];
const emojiPool = ['☕️', '❓', '♾️', '🍕', '💡', '🤔', '💻', '🤯', '🔥'];
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const HostPrivilegesModal: React.FC<HostPrivilegesModalProps> = ({
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const {
    players,
    cardValues: globalCardValues,
    hostId,
    currentUser,
  } = useAppSelector((state) => state.game);

  const [localCardValues, setLocalCardValues] = useState(globalCardValues);
  const [selectedNewHost, setSelectedNewHost] = useState(hostId);

  const handleCardValueChange = (index: number, value: string) => {
    const newValues = [...localCardValues];
    newValues[index] = value;
    setLocalCardValues(newValues);
  };

  const handleRandomize = () => {
    const shuffledEmojis = shuffleArray(emojiPool);
    const shuffledNumbers = shuffleArray(numberPool);
    const selectedEmojis = shuffledEmojis.slice(0, 2);
    const selectedNumbers = shuffledNumbers.slice(0, 10).map(String);
    const newDeck = [...selectedNumbers, ...selectedEmojis];
    const finalShuffledDeck = shuffleArray(newDeck);
    setLocalCardValues(finalShuffledDeck);
  };

  // --- NUEVA FUNCIÓN PARA MANEJAR EL CAMBIO DE ROL ---
  const handleRoleChange = () => {
    if (currentUser) {
      dispatch(togglePlayerRole(currentUser.id));
      // No cerramos el modal aquí para que pueda guardar otros cambios si lo desea.
      // El usuario puede cerrar el modal o guardar cambios después.
    }
  };

  const handleSaveChanges = () => {
    dispatch(setCardValues(localCardValues));
    if (selectedNewHost !== hostId) {
      dispatch(assignHost(selectedNewHost!));
    }
    onClose();
  };

  const isCurrentUserTheHost = currentUser?.id === hostId;
  const currentUserRoleText =
    currentUser?.role === 'player' ? 'Jugador' : 'Espectador';

  return (
    <div className="host-modal-overlay">
      <div className="host-modal-content">
        <div className="host-modal-header">
          <h3>Opciones de la Sala</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="host-modal-body">
          <div className="modal-section">
            <h4>Valores de las Cartas</h4>
            {/* ... (contenido de edición de cartas) ... */}
            <div className="card-editor-grid">
              {localCardValues.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={(e) => handleCardValueChange(index, e.target.value)}
                  className="card-value-input"
                />
              ))}
            </div>
            <Button variant="outline" onClick={handleRandomize}>
              Usar Cartas Aleatorias
            </Button>
          </div>

          {/* --- SECCIÓN PARA CAMBIO DE ROL --- */}
          {isCurrentUserTheHost && (
            <div className="modal-section">
              <h4>Cambio de Rol</h4>
              <p className="modal-section__description">
                Tu rol actual es: <strong>{currentUserRoleText}</strong>. Puedes
                cambiar a observador si necesitas un descanso.
              </p>
              <Button variant="secondary" onClick={handleRoleChange}>
                {currentUser?.role === 'player'
                  ? 'Cambiar a Espectador'
                  : 'Volver a ser Jugador'}
              </Button>
            </div>
          )}
          {/* --- FIN DE LA SECCIÓN --- */}

          {isCurrentUserTheHost && (
            <div className="modal-section">
              <h4>Promover a Anfitrión</h4>
              {/* ... (contenido de selección de anfitrión) ... */}
              <p className="modal-section__description">
                El nuevo anfitrión tendrá control total sobre la sala.
              </p>
              <select
                className="player-select"
                value={selectedNewHost || ''}
                onChange={(e) => setSelectedNewHost(e.target.value)}
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}{' '}
                    {player.id === hostId ? '(Anfitrión Actual)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button onClick={handleSaveChanges} className="save-button">
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostPrivilegesModal;