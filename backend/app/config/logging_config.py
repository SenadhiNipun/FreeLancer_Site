import logging
import sys

from colorlog import ColoredFormatter

from .config import LOG_LEVEL

FORMAT = "%(log_color)s%(levelname)s%(reset)s: %(asctime)s - \033[1m%(name)s:%(lineno)s\033[0m -> %(message)s"

logging.basicConfig(level=logging.WARNING)


def get_logger(class_name: str):
    formatter = ColoredFormatter(
        FORMAT,
        datefmt=None,
        reset=True,
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "bold_red",
        },
        secondary_log_colors={},
        style="%"
    )

    logger = logging.getLogger(class_name)
    logger.setLevel(LOG_LEVEL)

    if not logger.handlers:
        stream_handler = logging.StreamHandler(stream=sys.stdout)
        stream_handler.setLevel(LOG_LEVEL)
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

    logger.propagate = False
    return logger