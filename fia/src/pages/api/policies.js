// simple API stub: GET lista, POST crear
export default function handler(req, res) {
  if (req.method === 'GET') {
    // devolver lista (mock)
    return res.status(200).json([{id:1,name:'Premium',price:1000}, {id:2,name:'Basica',price:300}]);
  }
  if (req.method === 'POST') {
    const body = req.body;
    // validar y crear (mock)
    return res.status(201).json({...body, id: Math.floor(Math.random()*10000)});
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
