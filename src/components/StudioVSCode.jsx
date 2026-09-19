import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import laptopSource from "./canvas/Laptop.jsx?raw";
import deskAssetsSource from "./canvas/DeskAssets.jsx?raw";
import canvasIndexSource from "./canvas/index.js?raw";
import studioSource from "./Studio.jsx?raw";
import studioVSCodeSource from "./StudioVSCode.jsx?raw";
import navbarSource from "./Navbar.jsx?raw";
import mouseSource from "./canvas/Mouse.jsx?raw";
import bottleSource from "./canvas/Bottle.jsx?raw";
import notebookSource from "./canvas/Notebook.jsx?raw";
import penSource from "./canvas/Pen.jsx?raw";

const MODEL_LIBRARY = [
  { id: "laptop", name: "Laptop" },
  { id: "desk", name: "Desk" },
  { id: "notebook", name: "Notebook" },
  { id: "pen", name: "Pen" },
  { id: "mug", name: "Coffee Mug" },
  { id: "bottle", name: "Water Bottle" },
  { id: "phone", name: "Phone" },
  { id: "mouse", name: "Mouse" },
  { id: "headphones", name: "Headphones" },
  { id: "chessboard", name: "Chessboard" },
];

const MODEL_FILE_REFERENCES = [
  { path: "src/components/canvas/Laptop.jsx", size: "~30 KB", tone: "core", models: ["all"] },
  { path: "src/components/canvas/DeskAssets.jsx", size: "~8 KB", tone: "preview", models: ["all"] },
  { path: "src/components/canvas/index.js", size: "~1 KB", tone: "routing", models: ["all"] },
  { path: "src/components/Studio.jsx", size: "~20 KB", tone: "ui", models: ["all"] },
  { path: "src/components/StudioVSCode.jsx", size: "~12 KB", tone: "ui", models: ["all"] },
  { path: "src/components/Navbar.jsx", size: "~11 KB", tone: "theme", models: ["all"] },
  { path: "src/components/canvas/Mouse.jsx", size: "<1 KB", tone: "model", models: ["mouse"] },
  { path: "src/components/canvas/Bottle.jsx", size: "<1 KB", tone: "model", models: ["bottle"] },
  { path: "src/components/canvas/Notebook.jsx", size: "<1 KB", tone: "model", models: ["notebook"] },
  { path: "src/components/canvas/Pen.jsx", size: "<1 KB", tone: "model", models: ["pen"] },
];

const REFERENCE_FILE_CONTENT = {
  "src/components/canvas/Laptop.jsx": laptopSource,
  "src/components/canvas/DeskAssets.jsx": deskAssetsSource,
  "src/components/canvas/index.js": canvasIndexSource,
  "src/components/Studio.jsx": studioSource,
  "src/components/StudioVSCode.jsx": studioVSCodeSource,
  "src/components/Navbar.jsx": navbarSource,
  "src/components/canvas/Mouse.jsx": mouseSource,
  "src/components/canvas/Bottle.jsx": bottleSource,
  "src/components/canvas/Notebook.jsx": notebookSource,
  "src/components/canvas/Pen.jsx": penSource,
};

const getFolderFromPath = (filePath) => filePath.split("/").slice(0, -1).join("/");

const StudioVSCode = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const activeModel = MODEL_LIBRARY.find((item) => item.id === modelId) || MODEL_LIBRARY[0];
  const [selectedFilePath, setSelectedFilePath] = useState("src/components/canvas/Laptop.jsx");
  const [openTabs, setOpenTabs] = useState(["src/components/canvas/Laptop.jsx"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("src/components/canvas");
  const [actionNote, setActionNote] = useState("");
  const fileViewerRef = useRef(null);

  const activeFiles = useMemo(
    () => MODEL_FILE_REFERENCES.filter((item) => item.models.includes("all") || item.models.includes(activeModel.id)),
    [activeModel.id]
  );

  const selectedFileContent = REFERENCE_FILE_CONTENT[selectedFilePath] || "Source preview is unavailable for this file.";

  const numberedLines = useMemo(() => {
    const lines = selectedFileContent.split("\n").map((line, index) => ({ number: index + 1, text: line }));
    if (!searchQuery.trim()) {
      return lines;
    }
    const q = searchQuery.trim().toLowerCase();
    return lines.filter((line) => line.text.toLowerCase().includes(q));
  }, [searchQuery, selectedFileContent]);

  const folderFiles = useMemo(
    () => activeFiles.filter((item) => getFolderFromPath(item.path) === activeFolder),
    [activeFiles, activeFolder]
  );

  const viewFile = (path) => {
    setSelectedFilePath(path);
    setActiveFolder(getFolderFromPath(path));
    setOpenTabs((currentTabs) => (currentTabs.includes(path) ? currentTabs : [...currentTabs, path]));
    window.setTimeout(() => {
      fileViewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const closeTab = (path) => {
    setOpenTabs((currentTabs) => {
      if (currentTabs.length === 1) {
        return currentTabs;
      }
      const nextTabs = currentTabs.filter((item) => item !== path);
      if (selectedFilePath === path) {
        const fallback = nextTabs[nextTabs.length - 1];
        setSelectedFilePath(fallback);
        setActiveFolder(getFolderFromPath(fallback));
      }
      return nextTabs;
    });
  };

  const setTransientActionNote = (note) => {
    setActionNote(note);
    window.setTimeout(() => {
      setActionNote((current) => (current === note ? "" : current));
    }, 1600);
  };

  const copyCode = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(selectedFileContent);
        setTransientActionNote("Code copied");
      }
    } catch (_error) {
      setActionNote("Copy blocked by browser");
    }
  };

  const copyPath = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(selectedFilePath);
        setTransientActionNote("Path copied");
      }
    } catch (_error) {
      setActionNote("Copy blocked by browser");
    }
  };

  const downloadFile = () => {
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

  return (
    <section className={`${styles.padding} max-w-7xl mx-auto relative z-0 pt-28`}>
      <motion.div variants={textVariant()} initial='hidden' animate='show' className='flex items-center justify-between gap-3 flex-wrap'>
        <div>
          <p className={styles.sectionSubText}>Redirected IDE Workspace</p>
          <h2 className={styles.sectionHeadText}>VS Code View.</h2>
        </div>
        <button
          type='button'
          onClick={() => navigate(`/studio/${activeModel.id}`)}
          className='px-3 py-2 rounded-md bg-tertiary text-white-100 text-sm border border-white/15 hover:border-white/30'
        >
          Back To Studio
        </button>
      </motion.div>

      <motion.p
        variants={fadeIn("up", "spring", 0.08, 1)}
        initial='hidden'
        animate='show'
        className='mt-4 text-secondary max-w-3xl text-[15px] leading-7'
      >
        Dedicated VS Code-style page for {activeModel.name}. Use portable actions only: copy code, copy path, or download file.
      </motion.p>

      <motion.div variants={fadeIn("up", "spring", 0.2, 1)} initial='hidden' animate='show' className='mt-8 rounded-2xl border border-white/10 bg-[#0f111a] overflow-hidden'>
        <div className='flex items-center justify-between gap-4 flex-wrap px-5 py-3 border-b border-white/10 bg-[#151925]'>
          <div className='flex items-center gap-3'>
            <span className='h-2.5 w-2.5 rounded-full bg-red-400/90' />
            <span className='h-2.5 w-2.5 rounded-full bg-amber-300/90' />
            <span className='h-2.5 w-2.5 rounded-full bg-emerald-400/90' />
            <h3 className='text-white-100 text-[18px] font-semibold'>Model Editor • {activeModel.name}</h3>
          </div>
          <Link to={`/studio/vscode/${activeModel.id}`} className='text-secondary text-sm'>/studio/vscode/{activeModel.id}</Link>
        </div>

        <div className='mx-5 mt-4 rounded-xl border border-cyan-400/20 bg-[#11212c] p-4'>
          <div className='flex items-center justify-between gap-3 flex-wrap'>
            <code className='text-sm text-cyan-100'>{selectedFilePath}</code>
            <div className='flex items-center gap-2 flex-wrap'>
              <button type='button' onClick={copyCode} className='text-[11px] text-violet-200 border border-violet-400/35 bg-violet-500/15 rounded-md px-2 py-1 hover:bg-violet-500/25'>Copy Code</button>
              <button type='button' onClick={copyPath} className='text-[11px] text-blue-200 border border-blue-400/35 bg-blue-500/15 rounded-md px-2 py-1 hover:bg-blue-500/25'>Copy Path</button>
              <button type='button' onClick={downloadFile} className='text-[11px] text-amber-200 border border-amber-400/35 bg-amber-500/15 rounded-md px-2 py-1 hover:bg-amber-500/25'>Download File</button>
            </div>
          </div>
          {actionNote ? <p className='mt-2 text-[11px] text-emerald-200'>{actionNote}</p> : null}
        </div>

        <div className='m-5 mt-4 rounded-xl border border-white/10 bg-[#111522] overflow-hidden'>
          <div className='grid xl:grid-cols-[280px,1fr] grid-cols-1'>
            <div className='border-r border-white/10 bg-[#121827]'>
              <div className='px-4 py-3 border-b border-white/10'>
                <div className='text-[11px] uppercase tracking-[0.2em] text-secondary'>Explorer</div>
                <div className='text-xs text-white-100 mt-2'>Folder: {activeFolder}</div>
              </div>
              <div className='p-3 space-y-2 max-h-[680px] overflow-auto'>
                {folderFiles.map((file) => (
                  <button
                    key={file.path}
                    type='button'
                    onClick={() => viewFile(file.path)}
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
                  <div key={tabPath} className={`group flex items-center gap-2 px-3 py-2 border-r border-white/10 min-w-[160px] ${tabPath === selectedFilePath ? "bg-[#0f111a] text-white-100" : "text-secondary"}`}>
                    <button type='button' onClick={() => viewFile(tabPath)} className='text-xs font-mono text-left truncate'>
                      {tabPath.split("/").pop()}
                    </button>
                    <button type='button' onClick={() => closeTab(tabPath)} className='text-[10px] text-secondary hover:text-white-100'>×</button>
                  </div>
                ))}
              </div>

              <div className='px-4 py-3 border-b border-white/10 bg-[#141a2a] flex items-center justify-between gap-3 flex-wrap'>
                <div className='text-xs text-secondary'>
                  File: <span className='text-white-100 font-mono'>{selectedFilePath}</span>
                </div>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder='Search in file...'
                  className='bg-[#0f1422] border border-white/15 text-white-100 text-xs rounded-md px-2.5 py-1.5 outline-none focus:border-cyan-300/45'
                />
              </div>

              <div ref={fileViewerRef} className='max-h-[500px] overflow-auto bg-[#0d1117]'>
                {numberedLines.map((line) => (
                  <div key={`${selectedFilePath}-${line.number}`} className='grid grid-cols-[56px,1fr] text-[11px] leading-5 border-b border-white/5 last:border-b-0'>
                    <div className='bg-[#0b0f14] px-3 py-1 text-right text-slate-500 select-none font-mono'>
                      {line.number}
                    </div>
                    <pre className='px-3 py-1 text-slate-300 font-mono whitespace-pre-wrap break-words'>{line.text || " "}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default StudioVSCode;
