import os
import contextlib

# base on: 
# https://docs.python.org/3/library/contextlib.html#contextlib.contextmanager
# https://stackoverflow.com/a/45669280
@contextlib.contextmanager
def supressed_output(enabled = True):
    if(not enabled): 
        yield
        return
    
    """Context manager to silence stdout and stderr temporarily."""
    with open(os.devnull, "w") as devnull:
        with contextlib.redirect_stdout(devnull), contextlib.redirect_stderr(devnull):
            yield