import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.resolve("./data.json");
function readData(){try{const raw=fs.readFileSync(DATA_FILE);return JSON.parse(raw);}catch{return{};}}
function writeData(d){fs.writeFileSync(DATA_FILE, JSON.stringify(d,null,2));}
function today(){return new Date().toISOString().slice(0,10);}
function generateId(){return crypto.randomBytes(4).toString("hex");}

// Redirect and log click
app.get("/r/:id", (req,res)=>{
  const {id} = req.params;
  const target = decodeURIComponent(req.query.to || "");
  if(!target) return res.status(400).send("Missing redirect target");
  const data = readData();
  const dateKey = today();
  if(!data[dateKey]) data[dateKey] = {};
  data[dateKey][id] = (data[dateKey][id] || 0) + 1;
  writeData(data);
  console.log(`🔹 [${dateKey}] Click logged: ${id} (${data[dateKey][id]} total)`);
  res.redirect(target);
});

// Create track link
app.post("/create-link", (req,res)=>{
  const { target, category } = req.body;
  if(!target) return res.status(400).json({ error: "Missing target URL" });
  const id = generateId();
  const data = readData();
  const dateKey = today();
  if(!data[dateKey]) data[dateKey] = {};
  // store initial zero count for id
  data[dateKey][id] = data[dateKey][id] || 0;
  writeData(data);
  const trackLink = `${req.protocol}://${req.get("host")}/r/${id}?to=${encodeURIComponent(target)}`;
  res.json({ id, trackLink });
});

// Stats endpoint
app.get("/stats", (req,res)=>{
  res.json(readData());
});

// send summary email
app.get("/send-summary", async (req,res)=>{
  const data = readData();
  const todayKey = today();
  const todayStats = data[todayKey] || {};
  const total = Object.values(todayStats).reduce((s,v)=>s+v,0);
  const unique = Object.keys(todayStats).length;
  const message = `<h2>Quick NewsGPT Daily Summary</h2><p>Date: <strong>${todayKey}</strong></p><p>Total Clicks: <strong>${total}</strong></p><p>Unique Links: <strong>${unique}</strong></p>`;
  try{
    const transporter = nodemailer.createTransport({service:'gmail', auth:{user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS}});
    await transporter.sendMail({from:`"Quick NewsGPT" <${process.env.EMAIL_USER}>`, to:process.env.EMAIL_TO, subject:`Daily Click Summary - ${todayKey}`, html:message});
    console.log('✅ Summary email sent successfully');
    res.json({ status:'ok', total });
  }catch(err){console.error('❌ Email send error:', err); res.status(500).json({ error:'Failed to send email' });}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`✅ Backend running with daily tracking on port ${PORT}`));
