const { log } = require('console');
const path = require('path');

const cargarArchivo = ( req, res = response ) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
    res.status(400).json('No hay archivos que subir');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  const { archivo } = req.files;
  const nombreCortado = archivo.name.split('.');
  const extension = nombreCortado[ nombreCortado.length - 1 ];

  // Validar la extensión
  const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
  if ( !extensionesValidas.includes( extension ) ) {
    return res.status(400).json({
      msg: `La extensión ${ extension } no es permitida, ${ extensionesValidas } `
    })
  }
  
  res.json({ extension });

  // const uploadPath = path.join( __dirname, '../uploads/', archivo.name);

  // archivo.mv(uploadPath, (err) => {
  //   if (err) {
  //     return res.status(500).json({ err });
  //   }

  //   res.json({ msg: 'File uploaded to ' + uploadPath });
  // });

}

module.exports = {
  cargarArchivo
}