"use client";

import { useEffect, useMemo, useState } from "react";

function money(value: number) {
  return value.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

function parseFreeNumber(raw: string) {
  const cleaned = raw.replace(/,/g, "").replace(/\s/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(Number.isFinite(value) ? String(value) : "");
  }, [value, focused]);

  return (
    <label className="kpi-label">
      {label}
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className="kpi-field"
          value={focused ? draft : Number.isFinite(value) ? String(value) : ""}
          onFocus={() => {
            setFocused(true);
            setDraft(Number.isFinite(value) ? String(value) : "");
          }}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            const parsed = parseFreeNumber(next);
            if (parsed !== null) onChange(parsed);
          }}
          onBlur={() => {
            const parsed = parseFreeNumber(draft);
            onChange(parsed ?? 0);
            setFocused(false);
          }}
        />
        {suffix ? <span className="text-sm text-[#555555]">{suffix}</span> : null}
      </div>
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F4F4F4] p-5">
      <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#555555]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{value}</p>
    </div>
  );
}

export function RevparCalculator() {
  const [mode, setMode] = useState<"revpar" | "adr" | "occ">("revpar");
  const [adr, setAdr] = useState(3000);
  const [occ, setOcc] = useState(65);
  const [revpar, setRevpar] = useState(1950);

  const result = useMemo(() => {
    if (mode === "revpar") return { label: "RevPAR", value: `THB ${money(adr * (occ / 100))}`, note: "ADR × Occupancy" };
    if (mode === "adr") return { label: "ADR", value: `THB ${money(occ ? revpar / (occ / 100) : 0)}`, note: "RevPAR ÷ Occupancy" };
    return { label: "Occupancy", value: `${adr ? ((revpar / adr) * 100).toFixed(1) : "0"}%`, note: "RevPAR ÷ ADR" };
  }, [mode, adr, occ, revpar]);

  return (
    <div className="kpi-card grid gap-6 p-7 lg:grid-cols-2">
      <div className="grid gap-4">
        <label className="kpi-label">
          ต้องการคำนวณ
          <select className="kpi-field mt-1" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="revpar">RevPAR from ADR + Occupancy</option>
            <option value="adr">ADR from RevPAR + Occupancy</option>
            <option value="occ">Occupancy from RevPAR + ADR</option>
          </select>
        </label>
        {mode !== "adr" ? <Field label="ADR" value={adr} onChange={setAdr} suffix="THB" /> : <Field label="RevPAR" value={revpar} onChange={setRevpar} suffix="THB" />}
        {mode !== "occ" ? <Field label="Occupancy" value={occ} onChange={setOcc} suffix="%" /> : <Field label="ADR" value={adr} onChange={setAdr} suffix="THB" />}
        {mode === "adr" ? <Field label="Occupancy" value={occ} onChange={setOcc} suffix="%" /> : null}
        {mode === "occ" ? <Field label="RevPAR" value={revpar} onChange={setRevpar} suffix="THB" /> : null}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#555555]">ผลการคำนวณ</p>
        <div className="mt-4">
          <Result label={result.label} value={result.value} />
        </div>
        <p className="mt-4 text-sm text-[#555555]">โหมดการคำนวณ · {result.note}</p>
      </div>
    </div>
  );
}

export function OtaCalculator() {
  const [revenue, setRevenue] = useState(900000);
  const [rate, setRate] = useState(18);
  const [period, setPeriod] = useState<"month" | "year">("month");
  const commission = revenue * (rate / 100);
  const net = revenue - commission;
  const annual = period === "year" ? commission : commission * 12;

  return (
    <div className="kpi-card grid gap-6 p-7 lg:grid-cols-2">
      <div className="grid gap-4">
        <Field label="รายได้รวมจาก OTA" value={revenue} onChange={setRevenue} suffix="THB" />
        <Field label="Commission OTA เฉลี่ย" value={rate} onChange={setRate} suffix="%" />
        <label className="kpi-label">
          ช่วงเวลา
          <select className="kpi-field mt-1" value={period} onChange={(event) => setPeriod(event.target.value as typeof period)}>
            <option value="month">รายเดือน</option>
            <option value="year">รายปี</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4">
        <Result label="รายได้รวม OTA" value={`THB ${money(revenue)}`} />
        <Result label="ต้นทุน Commission OTA" value={`THB ${money(commission)}`} />
        <Result label="รายได้สุทธิหลังหัก Commission" value={`THB ${money(net)}`} />
        <Result label="ประมาณการต้นทุน Commission OTA รายปี" value={`THB ${money(annual)}`} />
      </div>
    </div>
  );
}

export function BudgetCalculator() {
  const [rooms, setRooms] = useState(80);
  const [days, setDays] = useState(30);
  const [occ, setOcc] = useState(65);
  const [adr, setAdr] = useState(3000);
  const available = rooms * days;
  const sold = available * (occ / 100);
  const revenue = sold * adr;
  const revpar = adr * (occ / 100);

  return (
    <div className="kpi-card grid gap-6 p-7 lg:grid-cols-2">
      <div className="grid gap-4">
        <Field label="จำนวนห้องพัก" value={rooms} onChange={setRooms} />
        <Field label="วันเปิดดำเนินการ" value={days} onChange={setDays} suffix="วัน" />
        <Field label="เป้าหมาย Occupancy" value={occ} onChange={setOcc} suffix="%" />
        <Field label="เป้าหมาย ADR" value={adr} onChange={setAdr} suffix="THB" />
      </div>
      <div className="grid gap-4">
        <Result label="จำนวนห้องคืนที่มีขาย" value={money(available)} />
        <Result label="เป้าหมายห้องพักที่ขายได้" value={money(sold)} />
        <Result label="เป้าหมายรายได้ห้องพัก" value={`THB ${money(revenue)}`} />
        <Result label="RevPAR" value={`THB ${money(revpar)}`} />
      </div>
    </div>
  );
}

export function ProfitCalculator() {
  const [rooms, setRooms] = useState(80);
  const [days, setDays] = useState(30);
  const [occ, setOcc] = useState(65);
  const [adr, setAdr] = useState(3000);
  const [otaShare, setOtaShare] = useState(55);
  const [commission, setCommission] = useState(18);
  const [costPerRoom, setCostPerRoom] = useState(450);
  const [payroll, setPayroll] = useState(450000);
  const [overhead, setOverhead] = useState(180000);
  const [tech, setTech] = useState(35000);

  const available = rooms * days;
  const sold = available * (occ / 100);
  const revenue = sold * adr;
  const otaRevenue = revenue * (otaShare / 100);
  const otaCost = otaRevenue * (commission / 100);
  const roomCost = sold * costPerRoom;
  const gop = revenue - otaCost - roomCost - payroll - overhead - tech;

  return (
    <div className="kpi-card grid gap-6 p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="จำนวนห้องพัก" value={rooms} onChange={setRooms} />
        <Field label="วันเปิดดำเนินการ" value={days} onChange={setDays} suffix="วัน" />
        <Field label="Occupancy" value={occ} onChange={setOcc} suffix="%" />
        <Field label="ADR" value={adr} onChange={setAdr} suffix="THB" />
        <Field label="สัดส่วน OTA / การจองออนไลน์" value={otaShare} onChange={setOtaShare} suffix="%" />
        <Field label="Commission OTA เฉลี่ย" value={commission} onChange={setCommission} suffix="%" />
        <Field label="ต้นทุนต่อห้องที่ขายได้" value={costPerRoom} onChange={setCostPerRoom} suffix="THB" />
        <Field label="เงินเดือนรายเดือน" value={payroll} onChange={setPayroll} suffix="THB" />
        <Field label="ค่าใช้จ่ายส่วนกลางรายเดือน" value={overhead} onChange={setOverhead} suffix="THB" />
        <Field label="ระบบโรงแรม / เทคโนโลยี" value={tech} onChange={setTech} suffix="THB" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Result label="รายได้ห้องพักรวม" value={`THB ${money(revenue)}`} />
        <Result label="ต้นทุน Commission OTA" value={`THB ${money(otaCost)}`} />
        <Result label="ต้นทุนดำเนินงานห้องพัก" value={`THB ${money(roomCost)}`} />
        <Result label="ประมาณการ GOP" value={`THB ${money(gop)}`} />
      </div>
    </div>
  );
}

export function VatCalculator() {
  const [mode, setMode] = useState<"vat" | "wht" | "sc">("sc");
  const [amount, setAmount] = useState(10000);
  const [vat, setVat] = useState(7);
  const [service, setService] = useState(10);
  const serviceCharge = mode === "sc" ? amount * (service / 100) : 0;
  const taxable = amount + serviceCharge;
  const vatAmount = taxable * (vat / 100);
  const total = taxable + vatAmount;

  return (
    <div className="kpi-card grid gap-6 p-7 lg:grid-cols-2">
      <div className="grid gap-4">
        <label className="kpi-label">
          รูปแบบการคำนวณ
          <select className="kpi-field mt-1" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="vat">VAT เท่านั้น</option>
            <option value="wht">VAT + ภาษีหัก ณ ที่จ่าย</option>
            <option value="sc">Service Charge + VAT</option>
          </select>
        </label>
        <Field label="จำนวนเงิน" value={amount} onChange={setAmount} suffix="THB" />
        <Field label="VAT" value={vat} onChange={setVat} suffix="%" />
        {mode === "sc" ? <Field label="Service Charge" value={service} onChange={setService} suffix="%" /> : null}
      </div>
      <div className="grid gap-4">
        <Result label="ยอดก่อนภาษี" value={`THB ${money(amount)}`} />
        <Result label="Service Charge" value={`THB ${money(serviceCharge)}`} />
        <Result label="VAT" value={`THB ${money(vatAmount)}`} />
        <Result label="ยอดรวม" value={`THB ${money(total)}`} />
      </div>
    </div>
  );
}
