import React, { useEffect, useMemo, useRef, useState } from "react";
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
import laptopSource from "./canvas/Laptop.jsx?raw";
import deskAssetsSource from "./canvas/DeskAssets.jsx?raw";
import canvasIndexSource from "./canvas/index.js?raw";
import studioSource from "./Studio.jsx?raw";
import navbarSource from "./Navbar.jsx?raw";
import mouseSource from "./canvas/Mouse.jsx?raw";
import bottleSource from "./canvas/Bottle.jsx?raw";
import notebookSource from "./canvas/Notebook.jsx?raw";
import penSource from "./canvas/Pen.jsx?raw";

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

const MODEL_BUILD_PLAN = [
  "Define model geometry and material blocks in canvas scene components.",
  "Split each object into standalone model components for independent previews.",
  "Map each model to a Studio route for one-click visual verification.",
  "Connect theme state so materials and lights react in real time.",
  "Validate with build checks after each structural model update.",
];

const MODEL_FILE_REFERENCES = [
  {
    path: "src/components/canvas/Laptop.jsx",
    size: "~30 KB",
    tone: "core",
    impact: "Primary model geometry, palettes, lights, and scene assembly.",
    models: ["all"],
  },
  {
    path: "src/components/canvas/DeskAssets.jsx",
    size: "~8 KB",
    tone: "preview",
    impact: "Individual preview canvases and camera setups for each model.",
    models: ["all"],
  },
  {
    path: "src/components/canvas/index.js",
    size: "~1 KB",
    tone: "routing",
    impact: "Exports used by Studio and hero sections.",
    models: ["all"],
  },
  {
    path: "src/components/Studio.jsx",
    size: "~18 KB",
    tone: "ui",
    impact: "Library view, drag/drop planner, route mapping, and reference panels.",
    models: ["all"],
  },
  {
    path: "src/components/Navbar.jsx",
    size: "~11 KB",
    tone: "theme",
    impact: "Theme selector and real-time theme change events.",
    models: ["all"],
  },
  {
    path: "src/components/canvas/Mouse.jsx",
    size: "<1 KB",
    tone: "model",
    impact: "Standalone mouse canvas route wrapper.",
    models: ["mouse"],
  },
  {
    path: "src/components/canvas/Bottle.jsx",
    size: "<1 KB",
    tone: "model",
    impact: "Standalone bottle canvas route wrapper.",
    models: ["bottle"],
  },
  {
    path: "src/components/canvas/Notebook.jsx",
    size: "<1 KB",
    tone: "model",
    impact: "Standalone notebook canvas route wrapper.",
    models: ["notebook"],
  },
  {
    path: "src/components/canvas/Pen.jsx",
    size: "<1 KB",
    tone: "model",
    impact: "Standalone pen canvas route wrapper.",
    models: ["pen"],
  },
];

const MODEL_FOLDER_TREE = [
  "src/",
  "  components/",
  "    Studio.jsx",
  "    Navbar.jsx",
  "    canvas/",
  "      Laptop.jsx",
  "      DeskAssets.jsx",
  "      Mouse.jsx",
  "      Bottle.jsx",
  "      Notebook.jsx",
  "      Pen.jsx",
  "      Chessboard.jsx",
  "      index.js",
  "  utils/",
  "    motion.js",
  "public/",
  "  desktop_pc/",
  "  planet/",
];

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
const getFolderFromPath = (filePath) => filePath.split("/").slice(0, -1).join("/");

const REFERENCE_FILE_CONTENT = {
  "src/components/canvas/Laptop.jsx": laptopSource,
  "src/components/canvas/DeskAssets.jsx": deskAssetsSource,
  "src/components/canvas/index.js": canvasIndexSource,
  "src/components/Studio.jsx": studioSource,
  "src/components/Navbar.jsx": navbarSource,
  "src/components/canvas/Mouse.jsx": mouseSource,
  "src/components/canvas/Bottle.jsx": bottleSource,
  "src/components/canvas/Notebook.jsx": notebookSource,
  "src/components/canvas/Pen.jsx": penSource,
};

const toneClassByType = {
  core: "bg-cyan-500/20 text-cyan-200 border-cyan-400/35",
  preview: "bg-emerald-500/20 text-emerald-200 border-emerald-400/35",
  routing: "bg-indigo-500/20 text-indigo-200 border-indigo-400/35",
  ui: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/35",
  theme: "bg-amber-500/20 text-amber-200 border-amber-400/35",
  model: "bg-blue-500/20 text-blue-200 border-blue-400/35",
};

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
  const [themeName, setThemeName] = useState(() => document.documentElement.getAttribute("data-theme") || "rainbow-night");
  const [selectedFilePath, setSelectedFilePath] = useState("src/components/canvas/Laptop.jsx");
  const [activeFolder, setActiveFolder] = useState("src/components/canvas");
  const [openTabs, setOpenTabs] = useState(["src/components/canvas/Laptop.jsx"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNote, setActionNote] = useState("");
  const fileViewerRef = useRef(null);

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

  useEffect(() => {
    const syncTheme = () => {
      setThemeName(document.documentElement.getAttribute("data-theme") || "rainbow-night");
    };

    const observer = new MutationObserver(() => {
      syncTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("portfolio-theme-change", syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("portfolio-theme-change", syncTheme);
    };
  }, []);

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

  const viewFileInWeb = (relativePath) => {
    setSelectedFilePath(relativePath);
    setActiveFolder(getFolderFromPath(relativePath));
    setOpenTabs((currentTabs) => (currentTabs.includes(relativePath) ? currentTabs : [...currentTabs, relativePath]));
    window.setTimeout(() => {
      if (fileViewerRef.current) {
        fileViewerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const openFolderInWeb = (relativePath) => {
    setActiveFolder(getFolderFromPath(relativePath));
  };

  const setTransientActionNote = (note) => {
    setActionNote(note);
    window.setTimeout(() => {
      setActionNote((current) => (current === note ? "" : current));
    }, 1600);
  };

  const copyRelativePath = async (relativePath) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(relativePath);
        setTransientActionNote("Path copied");
      }
    } catch (_error) {
      setActionNote("Copy blocked by browser");
    }
  };

  const copySelectedCode = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(selectedFileContent);
        setTransientActionNote("Code copied");
      }
    } catch (_error) {
      setActionNote("Copy blocked by browser");
    }
  };

  const downloadSelectedFile = () => {
    const blob = new Blob([selectedFileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = selectedFilePath.split("/").pop() || "source.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setTransientActionNote("Download started");
  };

  const closeTab = (tabPath) => {
    setOpenTabs((currentTabs) => {
      if (currentTabs.length === 1) {
        return currentTabs;
      }

      const nextTabs = currentTabs.filter((item) => item !== tabPath);

      if (selectedFilePath === tabPath) {
        const fallback = nextTabs[nextTabs.length - 1];
        if (fallback) {
          setSelectedFilePath(fallback);
          setActiveFolder(getFolderFromPath(fallback));
        }
      }

      return nextTabs;
    });
  };

  const ActiveModelCanvas = MODEL_COMPONENTS[activeModel.id] || LaptopOnlyCanvas;
  const activeFileReferences = useMemo(
    () => MODEL_FILE_REFERENCES.filter((item) => item.models.includes("all") || item.models.includes(activeModel.id)),
    [activeModel.id]
  );
  const selectedFileContent = REFERENCE_FILE_CONTENT[selectedFilePath] || "Source preview is unavailable for this file.";
  const selectedFileLines = selectedFileContent.split("\n");
  const numberedFileLines = useMemo(
    () => selectedFileLines.map((line, index) => ({ number: index + 1, text: line })),
    [selectedFileLines]
  );
  const filteredNumberedLines = useMemo(() => {
    if (!searchQuery.trim()) {
      return numberedFileLines;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    return numberedFileLines.filter((line) => line.text.toLowerCase().includes(normalizedQuery));
  }, [numberedFileLines, searchQuery]);
  const activeFolderFiles = useMemo(
    () => MODEL_FILE_REFERENCES.filter((item) => getFolderFromPath(item.path) === activeFolder),
    [activeFolder]
  );

  useEffect(() => {
    const hasActiveModelFile = activeFileReferences.some((item) => item.path === selectedFilePath);

    if (!hasActiveModelFile && activeFileReferences.length > 0) {
      const nextPath = activeFileReferences[0].path;
      setSelectedFilePath(nextPath);
      setActiveFolder(getFolderFromPath(nextPath));
      setOpenTabs((currentTabs) => (currentTabs.includes(nextPath) ? currentTabs : [...currentTabs, nextPath]));
    }
  }, [activeFileReferences, selectedFilePath]);

  const terminalLines = useMemo(
    () => [
      `> Active model: ${activeModel.name}`,
      `> Route: /studio/${activeModel.id}`,
      `> Theme: ${themeName}`,
      `> Open tabs: ${openTabs.length}`,
      `> Selected file: ${selectedFilePath}`,
      `> Search query: ${searchQuery || "(none)"}`,
      "> Status: Preview synchronized with model registry",
    ],
    [activeModel.id, activeModel.name, openTabs.length, searchQuery, selectedFilePath, themeName]
  );

  const liveSignals = [
    { label: "Active Route", value: `/studio/${activeModel.id}`, color: "bg-cyan-300" },
    { label: "Theme", value: themeName, color: "bg-emerald-300" },
    { label: "Preview Canvas", value: ActiveModelCanvas.name || "Anonymous Canvas", color: "bg-indigo-300" },
    { label: "Model Category", value: activeModel.category, color: "bg-fuchsia-300" },
  ];

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

      <motion.div variants={fadeIn("up", "spring", 0.1, 1)} initial='hidden' animate='show' className='mt-4'>
        <Link
          to={`/studio/vscode/${activeModel.id}`}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151925] border border-cyan-400/30 text-cyan-200 text-sm hover:bg-[#1b2436] hover:border-cyan-300/50 transition-colors'
        >
          Open Dedicated VS Code Page
        </Link>
      </motion.div>

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

      <motion.div variants={fadeIn("up", "spring", 0.2, 1)} initial='hidden' animate='show' className='mt-8 rounded-2xl border border-white/10 bg-[#0f111a] overflow-hidden'>
        <div className='flex items-center justify-between gap-4 flex-wrap px-5 py-3 border-b border-white/10 bg-[#151925]'>
          <div className='flex items-center gap-3'>
            <span className='h-2.5 w-2.5 rounded-full bg-red-400/90' />
            <span className='h-2.5 w-2.5 rounded-full bg-amber-300/90' />
            <span className='h-2.5 w-2.5 rounded-full bg-emerald-400/90' />
            <h3 className='text-white-100 text-[20px] font-semibold'>Model Engineering Reference</h3>
          </div>
          <span className='text-secondary text-sm'>Tracking plan + live impact for {activeModel.name}</span>
        </div>

        <div className='px-5 pt-5'>
          <div className='text-[11px] uppercase tracking-[0.22em] text-secondary'>Editor Session</div>
        </div>

        <div className='mx-5 mt-3 rounded-xl border border-cyan-400/20 bg-[#11212c] p-4'>
          <div className='flex items-center justify-between gap-3 flex-wrap'>
            <div>
              <div className='text-[11px] uppercase tracking-[0.2em] text-cyan-200/80'>Selected File</div>
              <code className='text-sm text-cyan-100'>{selectedFilePath}</code>
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
              <button
                type='button'
                onClick={() => viewFileInWeb(selectedFilePath)}
                className='text-[11px] text-cyan-200 border border-cyan-400/35 bg-cyan-500/15 rounded-md px-2 py-1 hover:bg-cyan-500/25 transition-colors'
              >
                View Code
              </button>
              <button
                type='button'
                onClick={copySelectedCode}
                className='text-[11px] text-violet-200 border border-violet-400/35 bg-violet-500/15 rounded-md px-2 py-1 hover:bg-violet-500/25 transition-colors'
              >
                Copy Code
              </button>
              <button
                type='button'
                onClick={() => openFolderInWeb(selectedFilePath)}
                className='text-[11px] text-emerald-200 border border-emerald-400/35 bg-emerald-500/15 rounded-md px-2 py-1 hover:bg-emerald-500/25 transition-colors'
              >
                Open Folder
              </button>
              <button
                type='button'
                onClick={downloadSelectedFile}
                className='text-[11px] text-amber-200 border border-amber-400/35 bg-amber-500/15 rounded-md px-2 py-1 hover:bg-amber-500/25 transition-colors'
              >
                Download File
              </button>
              <button
                type='button'
                onClick={() => copyRelativePath(selectedFilePath)}
                className='text-[11px] text-blue-200 border border-blue-400/35 bg-blue-500/15 rounded-md px-2 py-1 hover:bg-blue-500/25 transition-colors'
              >
                Copy Path
              </button>
            </div>
          </div>
          <p className='mt-2 text-[11px] text-cyan-100/70'>Portable actions only: copy code, copy relative path, or download file to your own system.</p>
          {actionNote ? <p className='mt-1 text-[11px] text-emerald-200'>{actionNote}</p> : null}
        </div>

        <div className='m-5 mt-5 rounded-xl border border-white/10 bg-[#111522] overflow-hidden'>
          <div className='grid xl:grid-cols-[280px,1fr] grid-cols-1'>
            <div className='border-r border-white/10 bg-[#121827]'>
              <div className='px-4 py-3 border-b border-white/10'>
                <div className='text-[11px] uppercase tracking-[0.2em] text-secondary'>Explorer</div>
                <div className='text-xs text-white-100 mt-2'>Active folder: {activeFolder}</div>
              </div>
              <div className='p-3 space-y-2 max-h-[680px] overflow-auto'>
                {activeFolderFiles.map((file) => (
                  <button
                    key={file.path}
                    type='button'
                    onClick={() => viewFileInWeb(file.path)}
                    className={`w-full text-left text-xs rounded-md border px-2.5 py-2 transition-colors font-mono ${
                      selectedFilePath === file.path
                        ? "border-cyan-400/35 bg-cyan-500/15 text-cyan-200"
                        : "border-white/10 bg-[#0f1422] text-secondary hover:text-white-100 hover:border-white/25"
                    }`}
                  >
                    {file.path.replace(`${activeFolder}/`, "")}
                  </button>
                ))}
              </div>
            </div>

            <div className='min-w-0'>
              <div className='flex items-center overflow-x-auto border-b border-white/10 bg-[#1a2132]'>
                {openTabs.map((tabPath) => (
                  <div
                    key={tabPath}
                    className={`group flex items-center gap-2 px-3 py-2 border-r border-white/10 min-w-[160px] ${
                      tabPath === selectedFilePath ? "bg-[#0f111a] text-white-100" : "text-secondary"
                    }`}
                  >
                    <button type='button' onClick={() => viewFileInWeb(tabPath)} className='text-xs font-mono text-left truncate'>
                      {tabPath.split("/").pop()}
                    </button>
                    <button
                      type='button'
                      onClick={() => closeTab(tabPath)}
                      className='text-[10px] text-secondary hover:text-white-100 transition-colors'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className='px-4 py-3 border-b border-white/10 bg-[#141a2a] flex items-center justify-between gap-3 flex-wrap'>
                <div className='text-xs text-secondary'>
                  File: <span className='text-white-100 font-mono'>{selectedFilePath}</span>
                </div>
                <div className='flex items-center gap-2 flex-wrap'>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder='Search in file...'
                    className='bg-[#0f1422] border border-white/15 text-white-100 text-xs rounded-md px-2.5 py-1.5 outline-none focus:border-cyan-300/45'
                  />
                  <button
                    type='button'
                    onClick={copySelectedCode}
                    className='text-[11px] text-violet-200 border border-violet-400/35 bg-violet-500/15 rounded-md px-2 py-1 hover:bg-violet-500/25 transition-colors'
                  >
                    Copy Code
                  </button>
                  <button
                    type='button'
                    onClick={downloadSelectedFile}
                    className='text-[11px] text-amber-200 border border-amber-400/35 bg-amber-500/15 rounded-md px-2 py-1 hover:bg-amber-500/25 transition-colors'
                  >
                    Download
                  </button>
                </div>
              </div>

              <div ref={fileViewerRef} className='max-h-[500px] overflow-auto bg-[#0d1117]'>
                {(filteredNumberedLines.length > 0 ? filteredNumberedLines : numberedFileLines).map((line) => (
                  <div key={`${selectedFilePath}-${line.number}`} className='grid grid-cols-[56px,1fr] text-[11px] leading-5 border-b border-white/5 last:border-b-0'>
                    <div className='bg-[#0b0f14] px-3 py-1 text-right text-slate-500 select-none font-mono'>
                      {line.number}
                    </div>
                    <pre className='px-3 py-1 text-slate-300 font-mono whitespace-pre-wrap break-words'>{line.text || " "}</pre>
                  </div>
                ))}
              </div>

              <div className='border-t border-white/10 bg-[#121827] px-4 py-3 grid md:grid-cols-2 gap-4'>
                <div>
                  <h4 className='text-white-100 text-sm font-semibold'>Live Change Signals</h4>
                  <div className='mt-2 space-y-1.5'>
                    {liveSignals.map((signal) => (
                      <div key={signal.label} className='flex items-center justify-between gap-2 rounded-md border border-white/10 px-2.5 py-1.5'>
                        <div className='flex items-center gap-2 text-xs text-secondary'>
                          <span className={`h-2 w-2 rounded-full ${signal.color}`} />
                          {signal.label}
                        </div>
                        <code className='text-[11px] text-white-100'>{signal.value}</code>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className='text-white-100 text-sm font-semibold'>Terminal</h4>
                  <div className='mt-2 rounded-md border border-white/10 bg-[#0c1019] p-2.5 space-y-1 max-h-[170px] overflow-auto'>
                    {terminalLines.map((line) => (
                      <div key={line} className='text-[11px] text-emerald-200 font-mono'>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mx-5 mb-5 grid xl:grid-cols-[1fr,1fr] grid-cols-1 gap-5'>
          <div className='rounded-xl border border-white/10 bg-[#171c29] p-5'>
            <h4 className='text-white-100 text-[18px] font-semibold'>Code Files Affecting This Model</h4>
            <p className='text-secondary text-sm mt-2'>File size and color tags help identify where to edit first when behavior changes.</p>
            <div className='mt-4 space-y-2'>
              {activeFileReferences.map((file) => (
                <div key={file.path} className='rounded-md border border-white/10 bg-[#111522] p-2.5'>
                  <div className='flex items-center justify-between gap-2'>
                    <button
                      type='button'
                      onClick={() => viewFileInWeb(file.path)}
                      className='text-[12px] text-cyan-100 underline decoration-cyan-200/30 hover:decoration-cyan-200 transition-all text-left font-mono'
                    >
                      {file.path}
                    </button>
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md border ${toneClassByType[file.tone] || "bg-white/10 text-white-100 border-white/20"}`}>
                      {file.tone}
                    </span>
                  </div>
                  <div className='mt-1 text-[11px] text-secondary'>{file.size} • {file.impact}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-xl border border-white/10 bg-[#171c29] p-5'>
            <h4 className='text-white-100 text-[18px] font-semibold'>Implementation Plan</h4>
            <ol className='mt-4 space-y-2 text-sm text-secondary list-decimal list-inside'>
              {MODEL_BUILD_PLAN.map((step) => (
                <li key={step} className='leading-6'>
                  {step}
                </li>
              ))}
            </ol>
            <pre className='mt-4 text-xs leading-6 text-secondary overflow-auto font-mono rounded-md border border-white/10 bg-[#111522] p-3'>
{MODEL_FOLDER_TREE.join("\n")}
            </pre>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Studio;
