'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AGENT_COMMANDS, AgentCommandItem } from '../data/agentCommands';

interface UseAgentSlashCommandsProps {
  prompt: string;
  onChangePrompt: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function useAgentSlashCommands({
  prompt,
  onChangePrompt,
  textareaRef,
}: UseAgentSlashCommandsProps) {
  const [slashRange, setSlashRange] = useState<{ start: number; end: number; query: string } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Check if cursor is currently within a /command token
  const inspectCursor = useCallback(() => {
    if (!textareaRef.current) {
      setSlashRange(null);
      return;
    }

    const cursorPos = textareaRef.current.selectionStart;
    const textBefore = prompt.slice(0, cursorPos);

    // Match a slash command at start of prompt or preceded by whitespace
    const match = textBefore.match(/(?:^|\s)(\/([a-zA-Z0-9_\u0600-\u06FF]*))$/);

    if (match && typeof match.index === 'number') {
      const slashIndex = match.index + (match[0].startsWith('/') ? 0 : 1);
      const query = match[2] || '';
      setSlashRange({
        start: slashIndex,
        end: cursorPos,
        query,
      });
      setSelectedIndex(0);
    } else {
      setSlashRange(null);
    }
  }, [prompt, textareaRef]);

  // Re-inspect cursor whenever prompt or textarea state updates
  useEffect(() => {
    inspectCursor();
  }, [prompt, inspectCursor]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!slashRange) return [];
    const q = slashRange.query.trim().toLowerCase();
    if (!q) return AGENT_COMMANDS;

    return AGENT_COMMANDS.filter((cmd) => {
      const cleanCmd = cmd.command.replace('/', '').toLowerCase();
      const matchCmd = cleanCmd.includes(q);
      const matchName = cmd.name.toLowerCase().includes(q);
      const matchNameFa = cmd.nameFa.toLowerCase().includes(q);
      const matchDesc = cmd.description.toLowerCase().includes(q);
      const matchDescFa = cmd.descriptionFa.toLowerCase().includes(q);
      const matchAliases = cmd.aliases?.some((a) => a.toLowerCase().includes(q));

      return matchCmd || matchName || matchNameFa || matchDesc || matchDescFa || matchAliases;
    });
  }, [slashRange]);

  const isOpen = slashRange !== null && filteredCommands.length > 0;

  const [activeTool, setActiveTool] = useState<AgentCommandItem | null>(null);

  const handleSelectCommand = useCallback(
    (cmd: AgentCommandItem) => {
      if (!slashRange || !textareaRef.current) return;

      const before = prompt.slice(0, slashRange.start);
      const after = prompt.slice(slashRange.end);
      // Cleanly remove the slash command query from textarea so the user writes clean prompt
      const newPrompt = (before + after).trimStart();

      onChangePrompt(newPrompt);
      setActiveTool(cmd);
      setSlashRange(null);

      // Keep focus in textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursor = before.length;
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 0);
    },
    [prompt, onChangePrompt, slashRange, textareaRef]
  );

  const handleRemoveActiveTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  // Detect if a full registered command was pasted or typed directly into the prompt
  useEffect(() => {
    const matches = prompt.match(/\/([a-zA-Z0-9_\u0600-\u06FF]+)/);
    if (matches && !activeTool) {
      const token = matches[0];
      const cmd = AGENT_COMMANDS.find(
        (c) =>
          c.command.toLowerCase() === token.toLowerCase() ||
          c.aliases?.some((a) => a.toLowerCase() === token.toLowerCase())
      );
      if (cmd) {
        setActiveTool(cmd);
        const cleaned = prompt.replace(token, '').replace(/\s+/g, ' ').trim();
        onChangePrompt(cleaned);
      }
    }
  }, [prompt, activeTool, onChangePrompt]);

  // Keyboard navigation handler for the command palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
      if (!isOpen) return false;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return true;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return true;
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelectCommand(filteredCommands[selectedIndex]);
        }
        return true;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setSlashRange(null);
        return true;
      }

      return false;
    },
    [isOpen, filteredCommands, selectedIndex, handleSelectCommand]
  );

  const closePalette = useCallback(() => {
    setSlashRange(null);
  }, []);

  // Compute active tools currently present in the prompt
  const activeTools = useMemo(() => {
    const matches = prompt.match(/\/([a-zA-Z0-9_\u0600-\u06FF]+)/g);
    if (!matches) return [];

    const list: AgentCommandItem[] = [];
    matches.forEach((token) => {
      const cmd = AGENT_COMMANDS.find(
        (c) =>
          c.command.toLowerCase() === token.toLowerCase() ||
          c.aliases?.some((a) => a.toLowerCase() === token.toLowerCase())
      );
      if (cmd && !list.some((item) => item.id === cmd.id)) {
        list.push(cmd);
      }
    });
    return list;
  }, [prompt]);

  // Remove a tool command from the prompt
  const handleRemoveTool = useCallback(
    (commandSlug: string) => {
      // Replace `/command` with empty string
      const escaped = commandSlug.replace('/', '\\/');
      const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'g');
      const updated = prompt.replace(regex, ' ').replace(/\s+/g, ' ').trim();
      onChangePrompt(updated);
    },
    [prompt, onChangePrompt]
  );

  return {
    isOpen,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleSelectCommand,
    closePalette,
    inspectCursor,
    activeTools,
    handleRemoveTool,
    activeTool,
    setActiveTool,
    handleRemoveActiveTool,
  };
}
