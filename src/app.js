const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const axios = require('axios');


const app = express()
const port = process.env.PORT || 5000
// Mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views',direktoriViews)
hbs.registerPartials(direktoriPartials)

//Setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman utama
app.get('', (req, res) => {
res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Nur Chintia Ningsih'
})
})

//ini halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Nur Chintia Ningsih',
    teksBantuan: 'Ini adalah teks bantuan'
    })
})

//ini halaman info Cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, 
location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
        }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'About Me',
        nama: 'Nur Chintia Ningsih',
        alamat: 'Simpang Nibung Rawas, Sumatera Selatan',
        telepon: '081273990743',
        email: 'nurchintia2@gmail.com',
        pendidikan: [
            {
                institusi: 'Universitas Negeri Padang',
                prodi: 'Informatika',
            }
        ],
        nim : '21343011',
        Hobby: ['Kulineran'],
        sertifikat: ['Sertifikat Olimpiade Fisika'],
    })
})

// ini halaman berita
app.get('/berita', async (req, res) => {
    try {
        const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
        const apiKey = '4a5a6c8d87d5a19dc803309ed8e12a08';

        const params = {
            access_key: apiKey,
            countries: 'id', 
        };

        const response = await axios.get(urlApiMediaStack, { params });
        const dataBerita = response.data;

        res.render('berita', {
            nama: 'Nur Chintia Ningsih',
            judul: 'Laman Berita',
            berita: dataBerita.data,
        });
    } catch (error) {
        console.error(error);
        res.render('error', {
            judul: 'Terjadi Kesalahan',
            pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
        });
    }
});



app.get('/bantuan/*',(req,res)=>{
    res.render('404',{
        judul: '404',
        nama: 'Nur Chintia Ningsih',
        pesanKesalahan:'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        judul:'404',
        nama: 'Nur Chintia Ningsih',
        pesanKesalahan:'Halaman tidak ditemukan'
    })
})

app.listen(port, () => {
console.log('Server berjalan pada port.' + port)
})