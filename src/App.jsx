import { useEffect, useState } from "react";
import "./App.css";

const records = [
  {
    id: 1,
    ad: "Berat",
    soyad: "Dimen",
    ePosta: "beratefedimen@hotmail.com",
    dogumTarihi: "1999-09-15",
  },
  {
    id: 2,
    ad: "Öznur",
    soyad: "Dimen",
    ePosta: "yilmazoznur53@gmail.com",
    dogumTarihi: "2000-09-14",
  },
  {
    id: 3,
    ad: "Sema",
    soyad: "Bekdemir",
    ePosta: "semabekdemir@gmail.com",
    dogumTarihi: "1996-05-21",
  },
  {
    id: 4,
    ad: "Ersel",
    soyad: "Bekdemir",
    ePosta: "erselbekdemir@gmail.com",
    dogumTarihi: "1996-04-07",
  },
];

localStorage.data = JSON.stringify(records);

function NewStudent({ isOpen, setIsOpen, data, setData }) {
  const [ad, setAd] = useState();
  const [soyad, setSoyad] = useState();
  const [ePosta, setEPosta] = useState();
  const [dogumTarihi, setDogumTarihi] = useState();

  function addNewStudent(e) {
    e.preventDefault();
    const student = {
      id: data.length + 1,
      ad: ad,
      soyad: soyad,
      ePosta: ePosta,
      dogumTarihi: dogumTarihi,
    };

    setData([...data, student]);
    save();

    setIsOpen(false);
  }

  return (
    <div>
      <dialog open={isOpen}>
        <div className="dialogContainer">
          <form onSubmit={addNewStudent}>
            <input
              type="text"
              placeholder="Ad"
              value={ad}
              onChange={(e) => setAd(e.target.value)}
            />
            <input
              type="text"
              placeholder="Soyad"
              value={soyad}
              onChange={(e) => setSoyad(e.target.value)}
            />
            <input
              type="text"
              placeholder="E-Posta"
              value={ePosta}
              onChange={(e) => setEPosta(e.target.value)}
            />
            <input
              type="date"
              placeholder="Doğum Tarihi"
              value={dogumTarihi}
              onChange={(e) => setDogumTarihi(e.target.value)}
            />

            <button type="submit">Gönder</button>
          </form>
          <button className="close" onClick={() => setIsOpen(false)}>
            Kapat
          </button>
        </div>
      </dialog>
    </div>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState(records);

  useEffect(() => {
    if (localStorage.data) {
      localStorage.data = JSON.stringify(records);
    }
    setData(JSON.parse(localStorage.data));
  }, []);

  function save() {
    localStorage.data = JSON.stringify(data);
  }

  function updateRecord(record) {
    let foundRecord = data.find((x) => x.id === record.id);
    // referansı bozmamak için object assign kullanıyoruz
    // eğer referansı kırarsak bu sefer gösterim sırası bozulur
    // eğer bu notları çözemezseniz referansı kırıp arayüzde probleme odaklanın
    Object.assign(foundRecord, record);
    setData([...data]);
    save();
  }

  function deleteRecord(id) {
    if (!confirm("Emin misiniz?")) {
      return;
    }

    setData(data.filter((x) => x.id !== id));
    save();
  }

  return (
    <div className="container">
      <h1>
        Öğrenci Bilgi Sistemi{" "}
        <button className="addStudent" onClick={() => setIsOpen(true)}>
          <img src="./img/new.png" alt="" />
        </button>
      </h1>
      <div className="studentTable">
        <ul className="studentTableTitles">
          <li>Ad</li>
          <li>Soyad</li>
          <li>E-Posta Adresi</li>
          <li>Doğum Tarihi</li>
          <li>##</li>
        </ul>
        {data.map((x) => (
          <StudentRow
            key={x.id}
            {...x}
            updateRecord={updateRecord}
            deleteRecord={deleteRecord}
          />
        ))}
      </div>
      <NewStudent
        isOpen={isOpen}
        data={data}
        setData={setData}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}

function StudentRow({
  id,
  ad,
  soyad,
  ePosta,
  dogumTarihi,
  updateRecord,
  deleteRecord,
}) {
  const [isEditing, setEditing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = id;
    updateRecord(formObj);
    setEditing(false);
  }

  return (
    <form onSubmit={handleSubmit} onDoubleClick={() => setEditing(true)}>
      {isEditing ? (
        <>
          <div className="studentTableCol">
            <input
              type="text"
              required
              placeholder="Ad"
              name="ad"
              defaultValue={ad}
            />
          </div>
          <div className="studentTableCol">
            <input
              type="text"
              required
              placeholder="Soyad"
              name="soyad"
              defaultValue={soyad}
            />
          </div>
          <div className="studentTableCol">
            <input
              type="mail"
              required
              placeholder="E-Posta"
              name="ePosta"
              defaultValue={ePosta}
            />
          </div>
          <div className="studentTableCol">
            <input
              type="date"
              required
              placeholder="Doğum Tarihi"
              name="dogumTarihi"
              defaultValue={dogumTarihi}
            />
          </div>
          <div className="studentTableCol">
            <button
              className="delBtn"
              type="button"
              onClick={() => setEditing(false)}
            >
              vazgeç
            </button>
            <button className="saveBtn" type="submit">
              kaydet
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="studentTableCol">{ad}</div>
          <div className="studentTableCol">{soyad}</div>
          <div className="studentTableCol">{ePosta}</div>
          <div className="studentTableCol">
            {dogumTarihi.split("-").reverse().join(".")}
          </div>
          <div className="studentTableCol">
            <button type="button" onClick={() => setEditing(true)}>
              Düzenle
            </button>
            <button
              className="delBtn"
              type="button"
              onClick={() => deleteRecord(id)}
            >
              Sil
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default App;
