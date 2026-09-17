import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import {
  BottleCanvas,
  ChessboardCanvas,
  DeskOnlyCanvas,
  HeadphonesOnlyCanvas,
  LaptopOnlyCanvas,
  MouseCanvas,
  MugOnlyCanvas,
  NotebookCanvas,
  PenCanvas,
  PhoneOnlyCanvas,
} from "./canvas";

const MODEL_LIBRARY = [
  {
    id: "laptop",
    name: "Laptop",
    category: "Core",
    description: "Primary workstation with integrated screen",
    kind: "3d",
  },
  {
    id: "desk",
    name: "Desk",
    category: "Furniture",
    description: "Desk base and inset platform",
    kind: "3d",
  },
  {
    id: "notebook",
    name: "Notebook",
    category: "Accessory",
    description: "Book stack prop",
    kind: "3d",
  },
  {
    id: "pen",
    name: "Pen",
    category: "Accessory",
    description: "Standalone pen model",
    kind: "3d",
  },
  {
    id: "mug",
    name: "Coffee Mug",
    category: "Accessory",
    description: "Mug with animated steam",
    kind: "3d",
  },
  {
    id: "bottle",
    name: "Water Bottle",
    category: "Accessory",
    description: "Glass bottle desk prop",
    kind: "3d",
  },
  {
    id: "phone",
    name: "Phone",
    category: "Accessory",
    description: "Smartphone with glowing display",
    kind: "3d",
  },
  {
    id: "mouse",
    name: "Mouse",
    category: "Accessory",
    description: "Standalone desk mouse model",
    kind: "3d",
  },
  {
    id: "headphones",
    name: "Headphones",
    category: "Accessory",
    description: "Over-ear headset model",
    kind: "3d",
  },
  {
    id: "chessboard",
    name: "Chessboard",
    category: "Core",
    description: "Interactive board prop",
    kind: "3d",
  },
];

const MODEL_COMPONENTS = {
  laptop: LaptopOnlyCanvas,
  desk: DeskOnlyCanvas,
  notebook: NotebookCanvas,
  pen: PenCanvas,
  mug: MugOnlyCanvas,
  bottle: BottleCanvas,
  phone: PhoneOnlyCanvas,
  mouse: MouseCanvas,
  headphones: HeadphonesOnlyCanvas,
  chessboard: ChessboardCanvas,
};

const DEFAULT_LAYOUT = {
  desk: { x: 50, y: 72 },
  laptop: { x: 43, y: 48 },
  notebook: { x: 30, y: 56 },
  pen: { x: 34, y: 60 },
  mug: { x: 58, y: 56 },
  bottle: { x: 66, y: 46 },
  phone: { x: 38, y: 66 },
  mouse: { x: 60, y: 62 },
  headphones: { x: 26, y: 46 },
  chessboard: { x: 52, y: 35 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const Studio = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [activeModelId, setActiveModelId] = useState(modelId || "laptop");
  const [placedItems, setPlacedItems] = useState(() => [
    {
      instanceId: `seed-desk-${Date.now()}`,
      modelId: "desk",
      x: DEFAULT_LAYOUT.desk.x,
      y: DEFAULT_LAYOUT.desk.y,
    },
  ]);
  const [dragPayload, setDragPayload] = useState(null);

  useEffect(() => {
    if (!modelId) {
      setActiveModelId("laptop");
      return;
    }

    const exists = MODEL_LIBRARY.some((item) => item.id === modelId);
    if (exists) {
      setActiveModelId(modelId);
    } else {
      navigate("/studio", { replace: true });
    }
  }, [modelId, navigate]);

  const activeModel = useMemo(
    () => MODEL_LIBRARY.find((item) => item.id === activeModelId) || MODEL_LIBRARY[0],
    [activeModelId]
  );

  const categoryList = useMemo(
    () => ["All", ...new Set(MODEL_LIBRARY.map((item) => item.category))],
    []
  );
  const [category, setCategory] = useState("All");

  const filteredLibrary = useMemo(() => {
    if (category === "All") {
      return MODEL_LIBRARY;
    }

    return MODEL_LIBRARY.filter((item) => item.category === category);
  }, [category]);

  const openModelRoute = (id) => {
    setActiveModelId(id);
    navigate(`/studio/${id}`);
  };

  const handleLibraryDragStart = (event, id) => {
    const payload = `library:${id}`;
    event.dataTransfer.setData("text/plain", payload);
    setDragPayload(payload);
  };

  const handlePlacedItemDragStart = (event, instanceId) => {
    const payload = `placed:${instanceId}`;
    event.dataTransfer.setData("text/plain", payload);
    setDragPayload(payload);
  };

  const handleCanvasDrop = (event) => {
    event.preventDefault();

    const payload = event.dataTransfer.getData("text/plain") || dragPayload;
    if (!payload) {
      return;
    }

    const canvasRect = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - canvasRect.left) / canvasRect.width) * 100, 4, 96);
    const y = clamp(((event.clientY - canvasRect.top) / canvasRect.height) * 100, 6, 94);

    if (payload.startsWith("library:")) {
      const droppedModelId = payload.replace("library:", "");
      setPlacedItems((previous) => [
        ...previous,
        {
          instanceId: `${droppedModelId}-${Date.now()}-${Math.floor(Math.random() * 999)}`,
          modelId: droppedModelId,
          x,
          y,
        },
      ]);
      setDragPayload(null);
      return;
    }

    if (payload.startsWith("placed:")) {
      const targetInstanceId = payload.replace("placed:", "");
      setPlacedItems((previous) =>
        previous.map((item) =>
          item.instanceId === targetInstanceId
            ? {
                ...item,
                x,
                y,
              }
            : item
        )
      );
      setDragPayload(null);
    }
  };

  const removePlacedItem = (instanceId) => {
    setPlacedItems((previous) => previous.filter((item) => item.instanceId !== instanceId));
  };

  const clearScene = () => {
    setPlacedItems([]);
  };

  const ActiveModelCanvas = MODEL_COMPONENTS[activeModel.id] || LaptopOnlyCanvas;

  return (
    <section className={`${styles.padding} max-w-7xl mx-auto relative z-0 pt-28`}>
      <motion.div variants={textVariant()} initial='hidden' animate='show'>
        <p className={styles.sectionSubText}>Model library and assembly lab</p>
        <h2 className={styles.sectionHeadText}>Studio.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("up", "spring", 0.08, 1)}
        initial='hidden'
        animate='show'
        className='mt-4 text-secondary max-w-3xl text-[15px] leading-7'
      >
        Open any model by route, build layouts independently, then assemble a complete desk scene using drag and drop. Share direct links like
        {" "}
        <Link to='/studio/laptop' className='text-white-100 underline underline-offset-4'>
          /studio/laptop
        </Link>
        {" "}
        ,
        {" "}
        <Link to='/studio/mouse' className='text-white-100 underline underline-offset-4'>
          /studio/mouse
        </Link>
        {" "}
        or
        {" "}
        <Link to='/studio/phone' className='text-white-100 underline underline-offset-4'>
          /studio/phone
        </Link>
        .
      </motion.p>

      <div className='mt-10 grid lg:grid-cols-[1.05fr,1.25fr] grid-cols-1 gap-8'>
        <motion.div variants={fadeIn("right", "spring", 0.15, 1)} initial='hidden' animate='show' className='bg-black-100 rounded-2xl p-6'>
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <h3 className='text-white-100 text-[24px] font-bold'>Model Library</h3>
            <div className='flex gap-2 flex-wrap'>
              {categoryList.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={() => setCategory(item)}
                  className={`px-3 py-1.5 rounded-full text-xs tracking-wide ${
                    category === item ? "bg-white text-black" : "bg-tertiary text-secondary hover:text-white-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-6 space-y-3'>
            {filteredLibrary.map((item) => (
              <article
                key={item.id}
                draggable
                onDragStart={(event) => handleLibraryDragStart(event, item.id)}
                className={`rounded-xl border p-4 cursor-grab active:cursor-grabbing transition-colors ${
                  activeModelId === item.id
                    ? "border-white/40 bg-tertiary"
                    : "border-white/10 bg-black-200 hover:border-white/30"
                }`}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h4 className='text-white-100 font-semibold text-[17px]'>{item.name}</h4>
                    <p className='text-secondary text-sm mt-1'>{item.description}</p>
                  </div>
                  <span className='text-[11px] uppercase tracking-wider text-secondary'>{item.kind}</span>
                </div>

                <div className='mt-4 flex items-center gap-3 flex-wrap'>
                  <button
                    type='button'
                    onClick={() => openModelRoute(item.id)}
                    className='bg-tertiary text-white-100 px-3 py-1.5 rounded-md text-xs'
                  >
                    Open Route
                  </button>
                  <code className='text-secondary text-xs'>/studio/{item.id}</code>
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeIn("left", "spring", 0.2, 1)} initial='hidden' animate='show' className='space-y-8'>
          <div className='bg-black-100 rounded-2xl p-6'>
            <div className='flex items-center justify-between gap-3 flex-wrap'>
              <h3 className='text-white-100 text-[24px] font-bold'>Model Route Preview</h3>
              <span className='text-secondary text-sm'>Active: /studio/{activeModel.id}</span>
            </div>

            <div className='mt-5 rounded-xl bg-black-200 h-[360px] overflow-hidden border border-white/10'>
              <ActiveModelCanvas />
            </div>
          </div>

          <div className='bg-black-100 rounded-2xl p-6'>
            <div className='flex items-center justify-between gap-3 flex-wrap'>
              <h3 className='text-white-100 text-[24px] font-bold'>Drag-and-Drop Scene Builder</h3>
              <button
                type='button'
                onClick={clearScene}
                className='text-secondary hover:text-white-100 text-sm transition-colors'
              >
                Clear Scene
              </button>
            </div>

            <div className='mt-4 text-secondary text-sm'>
              Drag from the library, or move items already on the table. This layout is your assembly plan before final 3D scene composition.
            </div>

            <div
              className='mt-6 relative h-[360px] rounded-xl border border-dashed border-white/20 bg-black-200/70 overflow-hidden'
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleCanvasDrop}
            >
              <div className='absolute inset-4 rounded-lg border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),linear-gradient(145deg,rgba(255,255,255,0.03),rgba(0,0,0,0.15))]' />

              {placedItems.map((item) => {
                const model = MODEL_LIBRARY.find((modelEntry) => modelEntry.id === item.modelId);
                if (!model) {
                  return null;
                }

                return (
                  <div
                    key={item.instanceId}
                    draggable
                    onDragStart={(event) => handlePlacedItemDragStart(event, item.instanceId)}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    className='absolute -translate-x-1/2 -translate-y-1/2 min-w-[96px] rounded-lg bg-tertiary/95 border border-white/20 px-3 py-2 cursor-move select-none shadow-lg'
                  >
                    <div className='text-[11px] uppercase tracking-wide text-secondary'>{model.category}</div>
                    <div className='text-white-100 text-sm font-semibold'>{model.name}</div>
                    <button
                      type='button'
                      onClick={() => removePlacedItem(item.instanceId)}
                      className='mt-1 text-[11px] text-secondary hover:text-white-100'
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Studio;
