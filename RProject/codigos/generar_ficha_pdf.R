## Hecho con IA
required_columns <- c(
  "Tema",
  "Indicador",
  "Temporalidad",
  #"En_razon",
  #"Sentido",
  "Descripción",
  "Fuente",
  "Unidad_medida"
)

display_columns <- c(
  "Indicador",
  "Tema",
  "Descripción",
  "Fuente",
  "Temporalidad",
  #"En_razon",
  #"Sentido",
  "Unidad_medida"
)

display_labels <- c(
  "Indicador",
  "Dimensión",
  "Definición",
  "Fuente",
  "Periodicidad",
  #"En razón",
  #"Sentido",
  "Unidad de medida"
)

page_width <- 8.5
page_height <- 11
cards_per_page <- 3
card_width <- 7.4
label_width <- 2.55
horizontal_padding <- 0.09
vertical_padding <- 0.035
row_min_height <- 0.22
card_gap <- 0.2
base_cex <- 0.9
minimum_cex <- 0.58

wrap_text <- function(text, width, cex, font = 1) {
  text <- gsub("[\r\n\t]+", " ", text)
  text <- trimws(gsub("[[:space:]]+", " ", text))
  if (!nzchar(text)) {
    return("")
  }

  words <- strsplit(text, " ", fixed = TRUE)[[1]]
  lines <- character()
  current_line <- ""

  for (word in words) {
    if (graphics::strwidth(word, units = "inches", cex = cex, font = font) > width) {
      characters <- strsplit(word, "", fixed = TRUE)[[1]]
      fragments <- character()
      fragment <- ""
      for (character in characters) {
        candidate <- paste0(fragment, character)
        if (nzchar(fragment) &&
            graphics::strwidth(candidate, units = "inches", cex = cex, font = font) > width) {
          fragments <- c(fragments, fragment)
          fragment <- character
        } else {
          fragment <- candidate
        }
      }
      fragments <- c(fragments, fragment)
    } else {
      fragments <- word
    }

    for (fragment in fragments) {
      candidate <- if (nzchar(current_line)) paste(current_line, fragment) else fragment
      if (nzchar(current_line) &&
          graphics::strwidth(candidate, units = "inches", cex = cex, font = font) > width) {
        lines <- c(lines, current_line)
        current_line <- fragment
      } else {
        current_line <- candidate
      }
    }
  }

  c(lines, current_line)
}

make_card_layout <- function(record, cex) {
  line_height <- max(
    graphics::strheight("Ag", units = "inches", cex = cex) * 1.25,
    0.1
  )
  value_width <- card_width - label_width
  labels <- vector("list", length(display_columns))
  values <- vector("list", length(display_columns))
  heights <- numeric(length(display_columns))

  for (i in seq_along(display_columns)) {
    label_font <- 2
    value_font <- if (i == 1) 2 else 1
    labels[[i]] <- wrap_text(
      display_labels[[i]],
      label_width - 2 * horizontal_padding,
      cex,
      label_font
    )
    values[[i]] <- wrap_text(
      record[[display_columns[[i]]]],
      value_width - 2 * horizontal_padding,
      cex,
      value_font
    )
    heights[[i]] <- max(
      row_min_height,
      max(length(labels[[i]]), length(values[[i]])) * line_height +
        2 * vertical_padding
    )
  }

  list(
    labels = labels,
    values = values,
    heights = heights,
    line_height = line_height,
    cex = cex
  )
}

draw_lines <- function(lines, x, row_bottom, row_height, line_height, cex, font, color) {
  text_block_height <- length(lines) * line_height
  first_y <- row_bottom + (row_height + text_block_height) / 2 - line_height / 2
  graphics::text(
    x = x,
    y = first_y - (seq_along(lines) - 1) * line_height,
    labels = lines,
    adj = c(0, 0.5),
    cex = cex,
    font = font,
    col = color,
    family = "sans",
    xpd = NA
  )
}

draw_card <- function(layout, top) {
  x_left <- (page_width - card_width) / 2
  x_middle <- x_left + label_width
  x_right <- x_left + card_width
  y_top <- top

  for (i in seq_along(display_columns)) {
    row_height <- layout$heights[[i]]
    y_bottom <- y_top - row_height

    if (i == 1) {
      label_fill <- "#641638"
      value_fill <- "#641638"
      text_color <- "#FFFFFF"
    } else if (i == 2) {
      label_fill <- "#B49B55"
      value_fill <- "#B49B55"
      text_color <- "#111111"
    } else {
      label_fill <- "#E9E9E9"
      value_fill <- "#FFFFFF"
      text_color <- "#111111"
    }

    graphics::rect(x_left, y_bottom, x_middle, y_top, col = label_fill, border = NA)
    graphics::rect(x_middle, y_bottom, x_right, y_top, col = value_fill, border = NA)

    value_font <- if (i == 1) 2 else 1
    draw_lines(
      layout$labels[[i]],
      x_left + horizontal_padding,
      y_bottom,
      row_height,
      layout$line_height,
      layout$cex,
      2,
      text_color
    )
    draw_lines(
      layout$values[[i]],
      x_middle + horizontal_padding,
      y_bottom,
      row_height,
      layout$line_height,
      layout$cex,
      value_font,
      text_color
    )
    graphics::segments(
      x_left,
      y_bottom,
      x_right,
      y_bottom,
      col = "#222222",
      lwd = 0.55
    )
    y_top <- y_bottom
  }

  y_bottom <- top - sum(layout$heights)
  graphics::segments(x_left, top, x_left, y_bottom, col = "#222222", lwd = 0.55)
  graphics::segments(x_middle, top, x_middle, y_bottom, col = "#222222", lwd = 0.55)
  graphics::segments(x_right, top, x_right, y_bottom, col = "#222222", lwd = 0.55)
  graphics::segments(x_left, top, x_right, top, col = "#222222", lwd = 0.55)
  sum(layout$heights)
}

find_project_root <- function() {
  script_arg <- grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)
  working_dir <- normalizePath(getwd(), winslash = "/", mustWork = TRUE)
  candidate_dirs <- c(
    working_dir,
    dirname(working_dir),
    dirname(dirname(working_dir))
  )
  if (length(script_arg)) {
    script_path <- sub("^--file=", "", script_arg[[1]])
    candidate_dirs <- c(dirname(dirname(normalizePath(script_path, mustWork = TRUE))), candidate_dirs)
  }
  candidate_dirs <- unique(normalizePath(candidate_dirs, winslash = "/", mustWork = TRUE))
  roots <- candidate_dirs[
    file.exists(file.path(candidate_dirs, "datos", "temporalidad.csv"))
  ]
  if (!length(roots)) {
    stop("No se encontró datos/temporalidad.csv. Ejecute el script desde el repositorio.", call. = FALSE)
  }
  roots[[1]]
}


generate_pdf <- function(input_path, output_path) {
  if (!file.exists(input_path)) {
    stop(sprintf("No existe el archivo de entrada: %s", input_path), call. = FALSE)
  }

  data <- utils::read.csv(
    input_path,
    fileEncoding = "UTF-8",
    stringsAsFactors = FALSE,
    check.names = FALSE,
    na.strings = NULL,
    colClasses = "character"
  )
  missing_columns <- setdiff(required_columns, names(data))
  if (length(missing_columns)) {
    stop(
      sprintf("Faltan columnas requeridas: %s", paste(missing_columns, collapse = ", ")),
      call. = FALSE
    )
  }
  if (!nrow(data)) {
    stop("El CSV no contiene fichas para generar.", call. = FALSE)
  }
  if (!isTRUE(capabilities("cairo"))) {
    stop("Esta instalación de R no tiene soporte Cairo para generar un PDF con acentos.", call. = FALSE)
  }

  data[is.na(data)] <- ""
  page_count <- ceiling(nrow(data) / cards_per_page)
  output_dir <- dirname(output_path)
  if (!dir.exists(output_dir) && !dir.create(output_dir, recursive = TRUE)) {
    stop(sprintf("No se pudo crear la carpeta de salida: %s", output_dir), call. = FALSE)
  }

  grDevices::cairo_pdf(
    filename = output_path,
    width = page_width,
    height = page_height,
    family = "sans",
    onefile = TRUE
  )
  device_open <- TRUE
  on.exit(if (device_open) grDevices::dev.off(), add = TRUE)
  graphics::par(ps = 10, family = "sans")

  for (page in seq_len(page_count)) {
    first_record <- (page - 1) * cards_per_page + 1
    last_record <- min(page * cards_per_page, nrow(data))
    record_indices <- seq.int(first_record, last_record)
    cex <- base_cex

    repeat {
      layouts <- lapply(record_indices, function(i) make_card_layout(data[i, , drop = FALSE], cex))
      total_height <- sum(vapply(layouts, function(layout) sum(layout$heights), numeric(1))) +
        card_gap * (length(layouts) - 1)
      if (total_height <= page_height - 1 || cex <= minimum_cex) {
        break
      }
      cex <- max(minimum_cex, cex - 0.03)
    }

    if (total_height > page_height - 1) {
      stop(sprintf("Los textos de la página %d no caben en una hoja tamaño carta.", page), call. = FALSE)
    }

    graphics::par(mar = c(0, 0, 0, 0), xaxs = "i", yaxs = "i")
    graphics::plot.new()
    graphics::plot.window(
      xlim = c(0, page_width),
      ylim = c(0, page_height),
      xaxs = "i",
      yaxs = "i"
    )

    top <- (page_height + total_height) / 2
    for (j in seq_along(record_indices)) {
      card_height <- draw_card(layouts[[j]], top)
      top <- top - card_height - card_gap
    }
  }

  grDevices::dev.off()
  device_open <- FALSE
  if (!file.exists(output_path) || file.info(output_path)$size <= 0) {
    stop(sprintf("No se pudo generar el PDF: %s", output_path), call. = FALSE)
  }

  cat(sprintf(
    "PDF generado: %s (%d fichas en %d páginas)\n",
    normalizePath(output_path, winslash = "/", mustWork = TRUE),
    nrow(data),
    page_count
  ))
}

run <- function() {
  args <- commandArgs(trailingOnly = TRUE)
  if (length(args) > 2) {
    stop(
      "Uso: Rscript RProject/codigos/generar_ficha_pdf.R [archivo.csv] [salida.pdf]",
      call. = FALSE
    )
  }

  project_root <- find_project_root()
  input_path <- if (length(args) >= 1) {
    args[[1]]
  } else {
    file.path(project_root, "datos", "temporalidad.csv")
  }
  output_path <- if (length(args) >= 2) {
    args[[2]]
  } else {
    file.path(project_root, "RProject", "Output", "fichasindicadores.pdf")
  }

  generate_pdf(input_path, output_path)
}

run()